import React, { Component } from 'react'
import { Map, List } from 'immutable'

import { PluginStoreType } from '../types/PluginStoreType'

/**
* @component PluginStore
*/
export class PluginStore extends Component {
  constructor (props) {
    super(props)
    this.absolute = this
  }

  getChildContext () {
    return { 'pluginStore': this }
  }

  /**
  * @see PluginStoreType.plugin
  */
  plugin (endpoint, ...values) {
    this.props.onChange('plugin', endpoint, ...values)
  }

  /**
  * @see PluginStoreType.plugout
  */
  plugout (endpoint, ...values) {
    this.props.onChange('plugout', endpoint, ...values)
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (endpoint, filter) {
    this.props.onChange('filter', endpoint, filter)
  }

  /**
  * @see PluginStoreType.clear
  */
  clear (endpoint) {
    this.props.onChange('clear', endpoint)
  }

  /**
  * @see PluginStoreType.get
  */
  get (endpoint) {
    if (this.props.value.has(endpoint)) {
      return this.props.value.get(endpoint).toJS()
    } else {
      return []
    }
  }

  /**
  * @see PluginStoreType.hasEndpoint
  */
  hasEndpoint (endpoint) {
    return this.props.value.has(endpoint)
  }

  /**
  * @see PluginStoreType.getEndpoints
  */
  getEndpoints () {
    return this.props.value.keySeq().toList().toJS()
  }

  render () {
    return this.props.children
  }
}

PluginStore.childContextTypes = {
  'pluginStore': PluginStoreType.isRequired
}

PluginStore.defaultProps = {
  'children': null
}

PluginStore.propTypes = {
  'children': React.PropTypes.node
}
