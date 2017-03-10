import React from 'react'
import { assign } from 'lodash'

import { PluginStore } from '../PluginStore/index'

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
        PluginStore.Endpoints.identifierToArray(this.props.name),
        PluginStore.Endpoints.identifierToArray(endpoint)
      )
    }

    /**
    * @see PluginStore.type.push
    */
    push (endpoint = [], ...params) {
      return this.pluginStore.push(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.delete
    */
    delete (endpoint = [], ...params) {
      return this.pluginStore.delete(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.filter
    */
    filter (endpoint = [], ...params) {
      return this.pluginStore.filter(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.get
    */
    get (endpoint = [], ...params) {
      return this.pluginStore.get(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.set
    */
    set (endpoint = [], ...params) {
      return this.pluginStore.set(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.endpoints
    */
    endpoints (endpoint = [], ...params) {
      return this.pluginStore.endpoints(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.has
    */
    has (endpoint = [], ...params) {
      return this.pluginStore.has(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.clear
    */
    clear (endpoint = [], ...params) {
      return this.pluginStore.clear(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.absolute
    */
    absolute () {
      return this.pluginStore.absolute()
    }

    /**
    * @see PluginStore.type.snapshot
    */
    snapshot (...params) {
      return this.pluginStore.snapshot(...params)
    }

    /**
    * @see PluginStore.type.onChange
    */
    onChange (...params) {
      return this.pluginStore.onChange(...params)
    }

    /**
    * @see PluginStore.type.isImmutable
    */
    isImmutable (...params) {
      return this.pluginStore.isImmutable(...params)
    }
  }

  /**
  * @see https://facebook.github.io/react/docs/context.html
  */
  result.contextTypes = assign({}, BaseClass.contextTypes, {
    'pluginStore': PluginStore.type.isRequired
  })

  /**
  * @see https://facebook.github.io/react/docs/context.html
  */
  result.childContextTypes = assign({}, BaseClass.childContextTypes, {
    'pluginStore': PluginStore.type.isRequired
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
