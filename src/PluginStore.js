import { Map, Record, List, fromJS } from 'immutable'
import { isString } from 'lodash'

const PluginStoreNode = new Record({
  'value': null,
  'children': new Map()
})

const EMPTY_NODE = new PluginStoreNode()

export class PluginStore {
  constructor (state = new PluginStoreNode()) {
    this.state = state
  }

  /**
  * Sanitize a path attribute.
  *
  * @param {Array<String>|String} path - Path to sanitize.
  *
  * @return {Array<String>} Sanitized path.
  */
  _sanitizePath (path = []) {
    if (isString(path)) {
      path = path.split('.')
    }

    return path
  }

  /**
  * Iterate along a path.
  *
  * @param {Array|String} path - Path to iterate.
  * @param {Function} [step=undefined]- Action to do on nodes along the path.
  * @param {any} [defaultValue=undefined] - Value to return if the iterator was not interupted, if null, this method will return the last itered node.
  *
  * @return {any} Nothing, or step function value if the step function return something.
  */
  _iterate (path = [], step, defaultValue) {
    path = this._sanitizePath(path)

    let node = this.state

    if (step) {
      let stepValue = step(node, '$root', -1)
      if (stepValue !== undefined) return stepValue
    }

    for (let index = 0; index < path.length; ++index) {
      if (node != null && node.children.has(path[index])) {
        node = node.children.get(path[index])
      } else {
        node = null
      }

      if (step) {
        let stepValue = step(node, path[index], index)
        if (stepValue !== undefined) return stepValue
      }
    }

    return (defaultValue === undefined) ? node : defaultValue
  }

  /**
  * Iterate along a path. (reverse)
  *
  * @see pluginStore._iterate
  */
  _reverse (path = [], step, defaultValue) {
    let stack = []
    let realPath = []

    this._iterate(path, (item, pathName) => {
      stack.push(item)
      realPath.push(pathName)
    })

    if (step) {
      for (let index = stack.length - 1; index >= 0; --index) {
        let stepValue = step(stack[index], realPath[index], index - 1)
        if (stepValue !== undefined) return stepValue
      }
    }

    return (defaultValue === undefined) ? stack[0] : defaultValue
  }

  /**
  * Check if a node is in this store.
  *
  * @param {Array|String} path - Path to the node to check.
  *
  * @return {Boolean} True if the node exists.
  */
  _hasNode (path = []) {
    return this._iterate(path) != null
  }

  /**
  * Return a node of this store.
  *
  * @param {Array|String} path - Path to the node to get.
  * @param {any} [defaultValue = null] - Value to return if the node doesn't exist.
  *
  * @return {PluginStoreNode} The node for the path.
  */
  _getNode (path = [], defaultValue = null) {
    return this._iterate(path) || defaultValue
  }

  /**
  * Set a node of this store.
  *
  * @param {Array|String} path - Path to the node to set.
  * @param {PluginStoreNode} newNode - New value of the node at the end of the path.
  *
  * @return {PluginStore} A new updated instance of this store.
  */
  _setNode (path = [], newNode) {
    path = this._sanitizePath(path)

    let result = newNode
    let parentPath = path.concat([])
    parentPath.pop()

    this._reverse(parentPath, (oldNode, index) => {
      oldNode = oldNode || EMPTY_NODE
      result = (oldNode).set(
        'children', (oldNode).get('children').set(path[index + 1], result)
      )
    })

    return new PluginStore(result)
  }

  /**
  * Remove a node value from this store.
  *
  * This method will remove all unnecessary nodes.
  *
  * @param {Array|String} path - Path to the node to remove.
  *
  * @return {PluginStore} A new updated instance of this store.
  */
  _deleteNode (path = []) {
    let newNodePath = path.concat([])
    let newNode = this._reverse(path, (element, index) => {
      if (index === path.length - 1) {
        if (element.get('children').size() > 0) {
          return element.set('value', null)
        }
      } else {
        if (element.get('children') > 1 || element.get('value') != null) {
          return element.set(
            'children', element.get('children').delete(path[index + 1])
          )
        }
      }
      newNodePath.pop()
    })

    return this._setNode(newNodePath, newNode || EMPTY_NODE)
  }

  /**
  * @see PluginStoreType.get
  */
  get (path = []) {
    let result = this._getNode(path, EMPTY_NODE).get('value')
    return (result != null && result.toJS) ? result.toJS() : result
  }

  /**
  * @see PluginStoreType.push
  */
  push (path = [], ...values) {
    let oldNode = this._getNode(path, EMPTY_NODE)
    let oldValue = oldNode.get('value') || new List()

    if (!List.isList(oldValue)) {
      oldValue = new List((oldValue.toJS) ? oldValue.toJS() : oldValue)
    }

    return this._setNode(path, oldNode.set('value', oldValue.push(...values)))
  }

  /**
  * @see PluginStoreType.delete
  */
  delete (path = [], ...values) {
    if (this._hasNode(path)) {
      if (values.length > 0) {
        return this._deleteValues(path, values)
      } else {
        return this._deleteNode(path)
      }
    }
  }

  _deleteValues (path, values) {
    let oldNode = this._getNode(path)
    let oldValue = oldNode.get('value')
    let newValue = null

    if (List.isList(oldValue)) {
      newValue = this._deleteFromList(path, oldValue, values)
    } else {
      newValue = this._deleteValue(path, oldValue, values)
    }

    if (newValue == null) {
      return this._deleteNode(path)
    } else {
      return this._setNode(path, oldNode.set('value', newValue))
    }
  }

  _deleteFromList (path, oldValue, values) {
    let result = oldValue

    for (let value of values) {
      let index = result.indexOf(value)
      if (index >= 0) {
        result = result.delete(index)
      }
    }

    if (result.size <= 0) {
      result = null
    }

    return result
  }

  _deleteValue (path, oldValue, values) {
    let tmp = (oldValue != null && oldValue.toJS) ? oldValue.toJS() : oldValue
    if (values.indexOf(tmp) >= 0) {
      return null
    } else {
      return oldValue
    }
  }

  /**
  * @see PluginStoreType.set
  */
  set (path = [], value) {
    if (value == null) {
      return this._deleteNode(path)
    } else {
      let oldNode = this._getNode(path, EMPTY_NODE)
      return this._setNode(path, oldNode.set('value', fromJS(value)))
    }
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (path = [], predicate) {
    let oldNode = this._getNode(path)
    let oldValue = oldNode.get('value')
    let newValue = null

    if (List.isList(oldValue)) {
      newValue = this._filterList(path, oldValue, predicate)
    } else {
      newValue = this._filterValue(path, oldValue, predicate)
    }

    if (newValue == null) {
      return this._deleteNode(path)
    } else {
      return this._setNode(path, oldNode.set('value', newValue))
    }
  }

  _filterList (path, oldValue, predicate) {
    let result = oldValue.filter(predicate)

    if (result.size <= 0) {
      return null
    } else {
      return result
    }
  }

  _filterValue (path, oldValue, predicate) {
    let tmp = (oldValue != null && oldValue.toJS) ? oldValue.toJS() : oldValue
    if (predicate(tmp)) {
      return null
    } else {
      return oldValue
    }
  }

  /**
  * @see PluginStoreType.endpoints
  */
  endpoints (endpoint = []) {
    if (isString(endpoint)) {
      endpoint = endpoint.split('.')
    }

    let stack = [this._toEndpointsState(this._getNode(endpoint))]
    let result = []
    if (stack[0].node.get('value') != null) result.push(null)

    while (stack.lengh > 0) {
      let current = stack[stack.length - 1]
      let nextElement = current.iterator.next()
      if (nextElement.done) {
        stack.pop()
      } else {
        let nextNode = current.node.get('children').get(nextElement.value)
        stack.push(this._toEndpointsState(nextNode, nextElement.value))

        if (nextNode.get('value') != null) {
          result.push(this._endpointsStackToPath(stack))
        }
      }
    }

    return result
  }

  _endpointsStackToPath (stack) {
    let result = []

    for (let node of stack) {
      if (node.name) result.push(node.name)
    }

    return result.join('.')
  }

  _toEndpointsState (node, name = null) {
    return {
      'node': node,
      'iterator': node.get('children').keys(),
      'name': null
    }
  }

  /**
  * @see PluginStoreType.has
  */
  has (endpoint = []) {
    let node = this._getNode(endpoint)

    if (node == null || node.get('value') == null) {
      return false
    } else {
      return true
    }
  }
}
