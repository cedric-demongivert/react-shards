import React, { Component } from 'react'

import { shards } from '../shards'
import { PluginStoreType } from '../types/PluginStoreType'

export class PluginStore extends Component {
  /**
  * @see https://facebook.github.io/react/docs/react-component.html#constructor
  */
  constructor (props) {
    super(props)

    this.state = {
      'store': props.from.get(props.name).snapshot()
    }

    this.onStoreChange = this.onStoreChange.bind(this)
  }

  /**
  * @see https://facebook.github.io/react/docs/context.html
  */
  getChildContext () {
    return {
      'pluginStore': this
    }
  }

  /**
  * @see https://facebook.github.io/react/docs/react-component.html#componentDidMount
  */
  componentDidMount () {
    this.props.from.registerOnChange(this.props.name, this.onStoreChange)
  }

  /**
  * @see https://facebook.github.io/react/docs/react-component.html#componentWillUnmount
  */
  componentWillUnmount () {
    this.props.from.unregisterOnChange(this.props.name, this.onStoreChange)
  }

  /**
  * When the store used by this component change.
  *
  * @param {PluginStoreType} oldStore - Old version of the store.
  * @param {PluginStoreType} newStore - Updated version of the store.
  */
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

  /**
  * @see https://facebook.github.io/react/docs/react-component.html#render
  */
  render () {
    return this.props.children
  }
}

/**
* @see https://facebook.github.io/react/docs/context.html
*/
PluginStore.childContextTypes = {
  'pluginStore': PluginStoreType.isRequired
}

/**
* @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
*/
PluginStore.defaultProps = {
  'children': null,
  'from': shards
}

/**
* @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
*/
PluginStore.propTypes = {
  'children': React.PropTypes.node,
  'from': React.PropTypes.any.isRequired,
  'name': React.PropTypes.string.isRequired
}
