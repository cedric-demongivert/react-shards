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
        return this.context.pluginStore.absolute()
      } else {
        return this.context.pluginStore
      }
    }

    _wrapReturn (store) {
      if (store.isImmutable()) {
        return new PluginStore.SubStore(store, this.props.name)
      } else {
        return this
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
      return PluginStore.Endpoints.identifierToArray(this.props.name).concat(
        PluginStore.Endpoints.identifierToArray(endpoint)
      )
    }

    /**
    * @see PluginStore.type.push
    */
    push (endpoint = [], ...params) {
      return this._wrapReturn(
        this.pluginStore.push(this.prefix(endpoint), ...params)
      )
    }

    /**
    * @see PluginStore.type.delete
    */
    delete (endpoint = [], ...params) {
      return this._wrapReturn(
        this.pluginStore.delete(this.prefix(endpoint), ...params)
      )
    }

    /**
    * @see PluginStore.type.filter
    */
    filter (endpoint = [], ...params) {
      return this._wrapReturn(
        this.pluginStore.filter(this.prefix(endpoint), ...params)
      )
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
      return this._wrapReturn(
        this.pluginStore.set(this.prefix(endpoint), ...params)
      )
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
      return this._wrapReturn(
        this.pluginStore.clear(this.prefix(endpoint), ...params)
      )
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
    snapshot (endpoint = [], ...params) {
      return this.pluginStore.snapshot(this.prefix(endpoint), ...params)
    }

    /**
    * @see PluginStore.type.onChange
    */
    onChange (endpoint = [], ...params) {
      return this.pluginStore.onChange(this.prefix(endpoint), ...params)
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
  result.contextTypes = assign({}, {
    'pluginStore': PluginStore.type.isRequired
  }, BaseClass.contextTypes)

  /**
  * @see https://facebook.github.io/react/docs/context.html
  */
  result.childContextTypes = assign({}, {
    'pluginStore': PluginStore.type.isRequired
  }, BaseClass.childContextTypes)

  /**
  * @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
  */
  result.defaultProps = assign({}, {
    'absolute': false
  }, BaseClass.defaultProps)

  /**
  * @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
  */
  result.propTypes = assign({}, {
    'name': React.PropTypes.string.isRequired,
    'absolute': React.PropTypes.bool
  }, BaseClass.propTypes)

  return result
}
