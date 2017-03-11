import React, { Component } from 'react'

import { Endpoint } from '../decorators/Endpoint'
import { BasicPluginRenderer } from '../decorators/BasicPluginRenderer'
import { InjectSlot } from './InjectSlot'

@BasicPluginRenderer
@Endpoint
export class Inject extends Component {
  renderPlugins (elements = []) {
    if (elements.length > 0) {
      let children = this.inject(elements, this.props.children)
      if (elements.length > 0) {
        this.injectLast(elements, children)
      }
      return children
    } else {
      return this.props.children
    }
  }

  injectLast (elements, component) {
    if (component == null) {
      if (elements.length <= 0) {
        return null
      } else if (elements.length === 1) {
        return elements[0]
      } else {
        return (<div>{ elements }</div>)
      }
    } else {
      return React.cloneElement(
        component, {},
        React.Children.toArray(component.props.children).concat(elements)
      )
    }
  }

  inject (elements, component) {
    if (component == null) {
      return null
    } else if (component.type === InjectSlot) {
      return this.handleInjectSlot(elements, component)
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
  'children': null
}

Inject.propTypes = {
  'children': React.PropTypes.element
}
