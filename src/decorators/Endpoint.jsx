import React from 'react'
import { assign } from 'lodash'

import { PluginStoreType } from '../components/Kernel'
import { Endpoints } from '../Endpoints'

export const Endpoint = (BaseClass) => {
  let result = class extends BaseClass {
    /**
    * @see https://facebook.github.io/react/docs/context.html
    */
    getChildContext () {
      let base = {}

      if (super.getChildContext) {
        base = super.getChildContext()
      }

      base.pluginStore = this

      return base
    }
    
    get prefix () {
      return Endpoints.identifierToArray(this.props.name)
    }

    /**
    * Convert à scoped endpoint to an unscoped endpoint (absolute path)
    *
    * @param {String|Array<String>} [endpoint=undefined] - Endpoint to unscope.
    *
    * @return {Array<String>} Unscoped endpoint.
    */
    unscope (endpoint = []) {
      return this.prefix.concat(Endpoints.identifierToArray(endpoint))
    }

    /**
    * @see PluginStoreType.push
    */
    push (endpoint = [], ...params) {
      return this.context.pluginStore.push(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.delete
    */
    delete (endpoint = [], ...params) {
      return this.context.pluginStore.delete(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.filter
    */
    filter (endpoint = [], ...params) {
      return this.context.pluginStore.filter(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.get
    */
    get (endpoint = [], ...params) {
      return this.context.pluginStore.get(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.set
    */
    set (endpoint = [], ...params) {
      return this.context.pluginStore.set(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.endpoints
    */
    endpoints (endpoint = [], ...params) {
      return this.context.pluginStore.endpoints(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.has
    */
    has (endpoint = [], ...params) {
      return this.context.pluginStore.has(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.clear
    */
    clear (endpoint = [], ...params) {
      return this.context.pluginStore.clear(
        this.unscope(endpoint), ...params
      )
    }

    /**
    * @see PluginStoreType.absolute
    */
    absolute () {
      return this.context.pluginStore.absolute()
    }
  }

  /**
  * @see https://facebook.github.io/react/docs/context.html
  */
  result.contextTypes = assign({}, BaseClass.contextTypes, {
    'pluginStore': PluginStoreType.isRequired
  })

  /**
  * @see https://facebook.github.io/react/docs/context.html
  */
  result.childContextTypes = assign({}, BaseClass.childContextTypes, {
    'pluginStore': PluginStoreType.isRequired
  })

  /**
  * @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
  */
  result.defaultProps = assign({}, BaseClass.defaultProps, {
    'absolute': false
  })

  /**
  * @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
  */
  result.propTypes = assign({}, BaseClass.propTypes, {
    'name': React.PropTypes.string.isRequired,
    'absolute': React.PropTypes.bool
  })

  return result
}

// getPlugged (name = undefined) {
//   if (name == null) {
//     return this.context.kernel.getPlugged(this.props.name)
//   } else {
//     return super.getPlugged(name)
//   }
// }
//
// hasPluggedContent () {
//   return this.context.kernel.hasPath(this.props.name)
// }
//
// toComponent (descriptor, props = undefined, children = undefined) {
//   if (React.isValidElement(descriptor)) {
//     return React.cloneElement(descriptor, props, children)
//   } else if (typeof (descriptor) === 'function') {
//     try {
//       return descriptor(props, children)
//     } catch (e) {
//       let Component = descriptor
//       return (<Component {... props}>{children}</Component>)
//     }
//   }
// }
//
// getComponentType (descriptor) {
//   if (React.isValidElement(descriptor)) {
//     return descriptor.type
//   } else if (typeof (descriptor) === 'function') {
//     try {
//       return descriptor().type
//     } catch (e) {
//       return descriptor
//     }
//   }
// }
