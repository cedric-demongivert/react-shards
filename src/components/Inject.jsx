import React, { Component } from 'react'

import { Endpoint } from '../decorators/Endpoint'
import { BasicPluginRenderer } from '../decorators/BasicPluginRenderer'
import { InjectSlot } from './InjectSlot'
import { Map } from '../Map/index.js'

function toIndexedComponents (component, index) {
  return React.cloneElement(component, {
    'key': index
  })
}

@BasicPluginRenderer
@Endpoint
export class Inject extends Component {
  renderPlugins (elements) {
    if (elements == null) {
      elements = []
    } else if (!Array.isArray(elements)) {
      elements = [elements]
    }

    if (elements.length > 0) {
      let children = this.inject(elements, this.props.children)
      if (elements.length > 0) {
        children = this.injectLast(elements, children)
      }
      return children
    } else {
      return this.props.children || null
    }
  }

  injectLast (elements, component) {
    if (component == null) {
      if (elements.length <= 0) {
        return null
      } else if (elements.length === 1) {
        return elements[0]
      } else {
        return (<div>{elements.map(toIndexedComponents)}</div>)
      }
    } else {
      return React.cloneElement(
        component, {},
        React.Children.toArray(component.props.children)
                      .concat(elements)
                      .map(toIndexedComponents)
      )
    }
  }

  inject (elements, component) {
    if (component == null) {
      return null
    } else if (component.type === InjectSlot) {
      return this.handleInjectSlot(elements, component)
    } else if ('pluginStore' in (component.type.contextTypes || {})) {
      return component
    } else {
      return React.cloneElement(
        component, {},
        React.Children.map(component.props.children, (child) => {
          return this.inject(elements, child)
        })
      )
    }
  }

  handleInjectSlot (elements, slot) {
    if (elements.length <= 0) return

    if (slot.props.inject === 'all') {
      return elements
    } else {
      return elements.splice(0, slot.props.inject)
    }
  }
}

Inject.defaultProps = {
  'map': Map.toComponent
}
