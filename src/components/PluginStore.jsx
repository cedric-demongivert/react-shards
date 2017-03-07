import React, { Component } from 'react'

import { pluginStores } from '../pluginStores'
import { PluginStoreType } from '../types/PluginStoreType'

export class PluginStore extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'store': props.from.get(props.name).snapshot()
    }

    this.onStoreChange = this.onStoreChange.bind(this)
  }

  getChildContext () {
    return {
      'pluginStore': this
    }
  }

  componentDidMount () {
    this.from.registerOnChange(this.onStoreChange)
  }

  componentWillUnmount () {
    this.from.unregisterOnChange(this.onStoreChange)
  }

  onStoreChange (oldStore, newStore) {
    this.setState({
      'store': newStore
    })
  }

  /**
  * @see PluginStoreType.push
  */
  push (... params) {
    this.props.from.get(this.props.name).push(... params)
    return this
  }

  /**
  * @see PluginStoreType.delete
  */
  delete (... params) {
    this.props.from.get(this.props.name).delete(... params)
    return this
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (... params) {
    this.props.from.get(this.props.name).filter(... params)
    return this
  }

  /**
  * @see PluginStoreType.get
  */
  get (... params) {
    return this.state.store.get(... params)
  }

  /**
  * @see PluginStoreType.set
  */
  set (... params) {
    this.props.from.get(this.props.name).set(... params)
    return this
  }

  /**
  * @see PluginStoreType.endpoints
  */
  endpoints (... params) {
    return this.state.store.endpoints(... params)
  }

  /**
  * @see PluginStoreType.has
  */
  has (... params) {
    return this.state.store.has(... params)
  }

  /**
  * @see PluginStoreType.clear
  */
  clear (... params) {
    this.props.from.get(this.props.name).clear(... params)
    return this
  }

  render () {
    return this.props.children
  }
}

PluginStore.childContextTypes = {
  'pluginStore': PluginStoreType.isRequired
}

PluginStore.defaultProps = {
  'children': null,
  'from': pluginStores
}

PluginStore.propTypes = {
  'children': React.PropTypes.node,
  'from': React.PropTypes.any.isRequired,
  'name': React.PropTypes.string.isRequired
}
