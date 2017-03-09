import { Map, Record, List, fromJS } from 'immutable'
import Endpoints from './Endpoints'

/**
* @class ImmutablePluginStoreNode
* @see https://facebook.github.io/immutable-js/docs/#/Record
*/
const ImmutablePluginStoreNode = new Record({
  'value': null,
  'children': new Map()
})

const EMPTY_NODE = new ImmutablePluginStoreNode()

/**
* @class ImmutablePluginStore
*
* A simple, Immutable implementation of PluginStoreType.
*/
export class ImmutablePluginStore {
  /**
  * Create a new empty store.
  *
  * @param {PluginStoreType} [toCopy=null] - Store to copy.
  */
  constructor (state = EMPTY_NODE) {
    if (state instanceof ImmutablePluginStoreNode) {
      this.state = state
    } else {
      this.state = EMPTY_NODE

      if (state) {
        let endpoints = state.endpoints()
        let store = new ImmutablePluginStore()

        for (let endpoint of endpoints) {
          store = store.set(endpoint, state.get(endpoint))
        }

        this.state = store.state
      }
    }
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
    path = Endpoints.identifierToArray(path)

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
  * @return {ImmutablePluginStoreNode} The node for the path.
  */
  _getNode (path = [], defaultValue = null) {
    return this._iterate(path) || defaultValue
  }

  /**
  * Set a node of this store.
  *
  * @param {Array|String} path - Path to the node to set.
  * @param {ImmutablePluginStoreNode} newNode - New value of the node at the end of the path.
  *
  * @return {PluginStore} A new updated instance of this store.
  */
  _setNode (path = [], newNode) {
    path = Endpoints.identifierToArray(path)

    if (path.length == 0 || path.length == 1 && path[0] == '') {
      return new ImmutablePluginStore(newNode)
    }

    let result = newNode
    let parentPath = path.concat([])
    parentPath.pop()

    this._reverse(parentPath, (oldNode, pathName, index) => {
      oldNode = oldNode || EMPTY_NODE
      result = (oldNode).set(
        'children', (oldNode).get('children').set(path[index + 1], result)
      )
    })

    return new ImmutablePluginStore(result)
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
    path = Endpoints.identifierToArray(path)

    let newNodePath = path.concat([])
    let newNode = this._reverse(path, (element, pathName, index) => {
      if (index === path.length - 1) {
        if (element.get('children').size > 0) {
          return element.set('value', null)
        }
      } else {
        if (
          element.get('children').size > 1
          || element.get('value') != null
          || index < 0
        ) {
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
  get (endpoint = []) {
    let result = this._getNode(endpoint, EMPTY_NODE).get('value')
    return (result != null && result.toJS) ? result.toJS() : result
  }

  /**
  * @see PluginStoreType.push
  */
  push (endpoint = [], ...values) {
    let oldNode = this._getNode(endpoint, EMPTY_NODE)
    let oldValue = oldNode.get('value') || new List()

    if (!List.isList(oldValue)) {
      oldValue = new List([(oldValue.toJS) ? oldValue.toJS() : oldValue])
    }

    return this._setNode(
      endpoint, oldNode.set('value', oldValue.push(...values))
    )
  }

  /**
  * @see PluginStoreType.delete
  */
  delete (endpoint = [], ...values) {
    if (this._hasNode(endpoint)) {
      if (values.length > 0) {
        return this._deleteValues(endpoint, values)
      } else {
        return this._deleteNode(endpoint)
      }
    }
    else {
      return this
    }
  }

  /**
  * Apply delete action on an endpoint.
  *
  * @param {Array<String>} endpoint - Endpoint to update.
  * @param {Array<any>} values - Values to delete.
  *
  * @return {PluginStore} An updated instance of this store.
  */
  _deleteValues (endpoint, values) {
    let oldNode = this._getNode(endpoint)
    let oldValue = oldNode.get('value')
    let newValue = null

    if (List.isList(oldValue)) {
      newValue = this._deleteFromList(oldValue, values)
    } else {
      newValue = this._deleteValue(oldValue, values)
    }

    if (newValue == null) {
      return this._deleteNode(endpoint)
    } else {
      return this._setNode(endpoint, oldNode.set('value', newValue))
    }
  }

  /**
  * Delete values from a list.
  *
  * @param {List<any>} oldValue - List to update.
  * @param {Array<any>} values - Values to remove.
  *
  * @return {List<any>} An updated list, or null if the result is empty.
  */
  _deleteFromList (oldValue, values) {
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

  /**
  * Delete values for endpoints that store a unique value.
  *
  * @param {any} oldValue - Value to check.
  * @param {Array<any>} values - Values to delete.
  *
  * @return {any} oldValue or null
  */
  _deleteValue (oldValue, values) {
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
  set (endpoint = [], value) {
    if (value == null) {
      return this._deleteNode(endpoint)
    } else {
      let oldNode = this._getNode(endpoint, EMPTY_NODE)
      return this._setNode(endpoint, oldNode.set('value', fromJS(value)))
    }
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (endpoint = [], predicate) {
    let oldNode = this._getNode(endpoint)
    let oldValue = oldNode.get('value')
    let newValue = null

    if (List.isList(oldValue)) {
      newValue = this._filterList(oldValue, predicate)
    } else {
      newValue = this._filterValue(oldValue, predicate)
    }

    if (newValue == null) {
      return this._deleteNode(endpoint)
    } else {
      return this._setNode(endpoint, oldNode.set('value', newValue))
    }
  }

  /**
  * Apply filtering to a list.
  *
  * @param {List<any>} oldValue - List to filter.
  * @param {Function} predicate - Filter.
  *
  * @return {List<any>} A filtered list, or null if the result is empty.
  */
  _filterList (oldValue, predicate) {
    let result = oldValue.filter(predicate)

    if (result.size <= 0) {
      return null
    } else {
      return result
    }
  }

  /**
  * Apply filtering to an endpoint that store a unique value.
  *
  * @param {any} oldValue - Value to filter.
  * @param {Function} predicate - Filter.
  *
  * @return {any} oldValue or null.
  */
  _filterValue (oldValue, predicate) {
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
    let rootNode = this._getNode(Endpoints.identifierToArray(endpoint))

    if (rootNode) {
      let stack = [this._toEndpointsState(rootNode)]
      let result = []
      if (stack[0].node.get('value') != null) result.push(null)

      while (stack.length > 0) {
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
    else {
      return []
    }
  }

  /**
  * Transform a state stack into an endpoint path.
  *
  * @param {Array<any>} stack - endpoints method stack
  *
  * @return {String} An endpoint Path.
  */
  _endpointsStackToPath (stack) {
    let result = []

    for (let node of stack) {
      if (node.name) result.push(node.name)
    }

    return result.join('.')
  }

  /**
  * Transform a ImmutablePluginStoreNode into a endpoint stack state.
  *
  * @param {ImmutablePluginStoreNode} node - Node to transform.
  * @param {String} [name = null] - Name of the node.
  *
  * @return An algorithm state.
  */
  _toEndpointsState (node, name = null) {
    return {
      'node': node,
      'iterator': node.get('children').keys(),
      'name': name
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

  /**
  * @see PluginStoreType.clear
  */
  clear (endpoint = []) {
    return this._setNode(endpoint, EMPTY_NODE)
  }

  /**
  * @see PluginStoreType.absolute
  */
  absolute () {
    return this
  }

  /**
  * @see PluginStoreType.onChange
  */
  onChange (endpoint, callback) {
    throw new Error([
      'Unnable to register a listener for the onChange event : this store is',
      'immutable, or derived from an immutable store.'
    ].joint(' '))
  }

  /**
  * @see PluginStoreType.snapshot
  */
  snapshot (endpoint = []) {
    endpoint = Endpoints.identifierToArray(endpoint)

    if (endpoint.lenght == 0) {
      return this
    } else {
      return new ImmutablePluginStore(this._getNode(endpoint))
    }
  }

  /**
  * @see PluginStoreType.isImmutable
  */
  isImmutable () {
    return true
  }
}
