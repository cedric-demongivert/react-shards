import React from 'react'
import { assign } from 'lodash'

import { PluginStoreType } from '../components/Kernel'
import { Endpoints } from '../Endpoints'

/**
* @decorator
*/
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

    get pluginStore () {
      if (this.props.absolute) {
        return this.pluginStore.absolute()
      } else {
        return this.pluginStore
      }
    }

    /**
    * Convert à scoped endpoint to an unscoped endpoint (absolute path)
    *
    * @param {String|Array<String>} [endpoint=undefined] - Endpoint to unscope.
    *
    * @return {Array<String>} Unscoped endpoint.
    */
    prefix (endpoint = []) {
      return this.prefix.concat(
        Endpoints.identifierToArray(this.props.name),
        Endpoints.identifierToArray(endpoint)
      )
    }

    /**
    * @see PluginStoreType.push
    */
    push (endpoint = [], ...params) {
      return this.pluginStore.push(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.delete
    */
    delete (endpoint = [], ...params) {
      return this.pluginStore.delete(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.filter
    */
    filter (endpoint = [], ...params) {
      return this.pluginStore.filter(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.get
    */
    get (endpoint = [], ...params) {
      return this.pluginStore.get(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.set
    */
    set (endpoint = [], ...params) {
      return this.pluginStore.set(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.endpoints
    */
    endpoints (endpoint = [], ...params) {
      return this.pluginStore.endpoints(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.has
    */
    has (endpoint = [], ...params) {
      return this.pluginStore.has(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.clear
    */
    clear (endpoint = [], ...params) {
      return this.pluginStore.clear(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStoreType.absolute
    */
    absolute () {
      return this.pluginStore.absolute()
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
