import React, { Component } from 'react'

import { Endpoint } from '../decorators/Endpoint'

const STATUS_UNRESOLVED = 0
const STATUS_RESOLVING = 1
const STATUS_RESOLVED = 2

/**
* Compose a bunch of component in regard of their contexts.
*
* ````jsx
* <Compose name="endpoints.name">
*   ...
* </Compose>
* ````
*/
@Endpoint
export class Compose extends Component {
  /**
  * Resolve the component composition order and return it.
  *
  * @return {Array} The component composition order.
  */
  resolve () {
    let result = []
    let pluggedComponents = this.getPlugged()
    let status = this.getBaseStatus(pluggedComponents)
    let services = this.getContextMap(pluggedComponents)

    for (let index in pluggedComponents) {
      this.visit(index, {pluggedComponents, status, services, result})
    }

    return result
  }

  /**
  * Return an object with exposed contexts as key, and an index list of
  * components that expose these contexts as value.
  *
  * @param {Array<component>} pluggedComponents - A list of components.
  * @return {Object} A context map.
  */
  getContextMap (pluggedComponents) {
    let result = {}

    for (let index in pluggedComponents) {
      let pluggedComponent = pluggedComponents[index]
      for (let exposed of this.getExposedServices(pluggedComponent)) {
        if (exposed in result) {
          result[exposed].push(index)
        } else {
          result[exposed] = [index]
        }
      }
    }

    return result
  }

  getExposedServices (component) {
    let componentType = this.getComponentType(component)
    let result = []

    if (componentType.childContextTypes) {
      for (let exposed in componentType.childContextTypes) {
        if (
          componentType.contextTypes == null ||
          !(exposed in componentType.contextTypes)
        ) {
          result.push(exposed)
        }
      }
    }

    if (result.length <= 0) {
      result.push('none')
    }

    return result
  }

  getBaseStatus (components) {
    let result = []

    for (let index in components) {
      result[index] = STATUS_UNRESOLVED
    }

    return result
  }

  visit (index, { pluggedComponents, status, services, result }) {
    if (status[index] === STATUS_UNRESOLVED) {
      status[index] = STATUS_RESOLVING

      for (let dependency in this.getDependencies(pluggedComponents[index])) {
        if (dependency in services) {
          for (let provider of services[dependency]) {
            this.visit(
              provider, { pluggedComponents, status, services, result }
            )
          }
        }
      }

      status[index] = STATUS_RESOLVED
      result.push(pluggedComponents[index])
    } else if (status[index] === STATUS_RESOLVING) {
      throw new Error(
        'Unable to compose components : invalid context dependency tree,',
        'have-you a circular context dependency somewhere ?'
      )
    }
  }

  getDependencies (component) {
    return this.getComponentType(component).contextTypes || {}
  }

  render () {
    return this.compose(this.resolve())
  }

  compose (components) {
    let result = this.props.children

    for (let index = 1; index <= components.length; ++index) {
      result = this.toComponent(
        components[components.length - index], {}, result
      )
    }

    return result
  }

}

Compose.defaultProps = {
  'children': null
}

Compose.propTypes = {
  'children': React.PropTypes.element
}
