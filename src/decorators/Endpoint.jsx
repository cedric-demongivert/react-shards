import React from 'react'
import { assign } from 'lodash'

import { Namespaced } from './Namespaced'
import { PluginStoreType } from '../components/Kernel'

export const Endpoint = (BaseClass) => {
  let result = class extends Namespaced(BaseClass) {
    getPlugged (name = undefined) {
      if (name == null) {
        return this.context.kernel.getPlugged(this.props.name)
      } else {
        return super.getPlugged(name)
      }
    }

    hasPluggedContent () {
      return this.context.kernel.hasPath(this.props.name)
    }

    toComponent (descriptor, props = undefined, children = undefined) {
      if (React.isValidElement(descriptor)) {
        return React.cloneElement(descriptor, props, children)
      } else if (typeof (descriptor) === 'function') {
        try {
          return descriptor(props, children)
        } catch (e) {
          let Component = descriptor
          return (<Component {... props}>{children}</Component>)
        }
      }
    }

    getComponentType (descriptor) {
      if (React.isValidElement(descriptor)) {
        return descriptor.type
      } else if (typeof (descriptor) === 'function') {
        try {
          return descriptor().type
        } catch (e) {
          return descriptor
        }
      }
    }
  }

  result.contextTypes = assign({}, BaseClass.contextTypes, {
    'kernel': Kernel.type.isRequired
  })

  return result
}
