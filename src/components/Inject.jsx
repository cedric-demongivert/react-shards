import React, { Component } from 'react'

import { Endpoint } from './Endpoint'
import { InjectIn } from './InjectIn'
import { InjectSlot } from './InjectSlot'

@Endpoint
export class Inject extends Component {
  inject (injectables, component) {
    if (component == null) {
      if (injectables.length <= 0) {
        return null
      } else if (injectables.length === 1) {
        return injectables[0]
      } else {
        return (<div>{ this.getInjectedChildren(injectables) }</div>)
      }
    }

    return React.cloneElement(
      component, {}, this.getInjectedChildren(injectables, component)
    )
  }

  getInjectedChildren (injectables, component) {
    let result = []

    if (component != null) {
      let childrens = this.getChildrenOf(component)

      for (let child of childrens) {
        if (child.type === InjectSlot) {
          this.handleInjectSlot(result, injectables, child)
        } else if (child.type === InjectIn) {
          this.handleInjectIn(result, injectables, child)
        } else {
          result.push(child)
        }
      }
    }

    while (injectables.length > 0) result.push(injectables.shift())

    result = result.map((x, index) => React.cloneElement(x, {'key': index}))

    return result
  }

  getChildrenOf (component) {
    if (component.props.children == null) {
      return []
    } else if (Array.isArray(component.props.children)) {
      return component.props.children
    } else {
      return [component.props.children]
    }
  }

  handleInjectSlot (result, injectables, slot) {
    if (injectables.length <= 0) return

    if (slot.props.inject === 'all') {
      while (injectables.length > 0) result.push(injectables.shift())
    } else {
      for (
        let index = 0;
        index < slot.props.inject && injectables.length > 0;
        ++index
      ) {
        result.push(injectables.shift())
      }
    }
  }

  handleInjectIn (result, injectables, slot) {
    let subInjectables = []

    if (slot.props.inject === 'all') {
      subInjectables = injectables
    } else {
      for (
        let index = 0;
        index < slot.props.inject && injectables.length > 0;
        ++index
      ) {
        subInjectables.push(injectables.shift())
      }
    }

    result.push(
      this._handleInjectIn(result, subInjectables, slot.props.children)
    )
  }

  _handleInjectIn (result, injectables, children) {
    if (
      children.props.children != null && Array.isArray(children.props.children)
    ) {
      return React.cloneElement(
        children.props.children, {}, this._handleInjectIn(
          result, injectables, children.props.children
        )
      )
    } else {
      return this.inject(injectables, children)
    }
  }

  render () {
    if (this.hasPluggedContent()) {
      let injectables = this.getPlugged().map((x) => this.toComponent(x))
      return this.inject(injectables, this.props.children)
    } else {
      return this.props.children
    }
  }
}

Inject.defaultProps = {
  'children': null
}

Inject.propTypes = {
  'children': React.PropTypes.element
}
