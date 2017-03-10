import React, { Component } from 'react'

import { defaultStore } from '../defaultStore'
import { PluginStore } from '../PluginStore/index'

export class Plugins extends Component {
  /**
  * @see https://facebook.github.io/react/docs/react-component.html#constructor
  */
  constructor (props) {
    super(props)

    this.state = {
      'pluginStore': new PluginStore.MirrorStore({
        parent: props.store.snapshot(),
        reflected: props.store
      })
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
    this.$unsubribe = this.props.store.onChange(null, this.onStoreChange)
  }

  /**
  * @see https://facebook.github.io/react/docs/react-component.html#componentDidUpdate
  */
  componentDidUpdate (prevProps) {
    if (this.props.store != prevProps.store) {
      this.$unsubribe()
      this.props.store.onChange(null, this.onStoreChange)
      this.setState({
        'pluginStore': new PluginStore.MirrorStore({
          parent: this.props.store.snapshot(),
          reflected: this.props.store
        })
      })
    }
  }

  /**
  * @see https://facebook.github.io/react/docs/react-component.html#componentWillUnmount
  */
  componentWillUnmount () {
    this.$unsubribe()
  }

  /**
  * When the store used by this component change.
  *
  * @param {PluginStore.type} newStore - The updated store.
  */
  onStoreChange (newStore) {
    this.setState({
      'store': {
        'pluginStore': new PluginStore.MirrorStore({
          parent: newStore.snapshot(),
          reflected: newStore
        })
      }
    })
  }

  /**
  * @see PluginStore.type.push
  */
  push (...params) {
    return this.state.pluginStore.push(...params)
  }

  /**
  * @see PluginStore.type.delete
  */
  delete (...params) {
    return this.state.pluginStore.delete(...params)
  }

  /**
  * @see PluginStore.type.filter
  */
  filter (...params) {
    return this.state.pluginStore.filter(...params)
  }

  /**
  * @see PluginStore.type.get
  */
  get (...params) {
    return this.state.pluginStore.get(...params)
  }

  /**
  * @see PluginStore.type.set
  */
  set (...params) {
    return this.state.pluginStore.set(...params)
  }

  /**
  * @see PluginStore.type.endpoints
  */
  endpoints (...params) {
    return this.state.pluginStore.endpoints(...params)
  }

  /**
  * @see PluginStore.type.has
  */
  has (...params) {
    return this.state.pluginStore.has(...params)
  }

  /**
  * @see PluginStore.type.clear
  */
  clear (...params) {
    return this.state.pluginStore.clear(...params)
  }

  /**
  * @see PluginStore.type.absolute
  */
  absolute (...params) {
    return this.state.pluginStore.absolute(...params)
  }

  /**
  * @see PluginStore.type.onChange
  */
  onChange (...params) {
    return this.state.pluginStore.onChange(...params)
  }

  /**
  * @see PluginStore.type.isImmutable
  */
  isImmutable (...params) {
    return this.state.pluginStore.isImmutable(...params)
  }

  /**
  * @see PluginStore.type.isImmutable
  */
  snapshot (...params) {
    return this.state.pluginStore.snapshot(...params)
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
Plugins.childContextTypes = {
  'pluginStore': PluginStore.type.isRequired
}

/**
* @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
*/
Plugins.defaultProps = {
  'children': null,
  'store': defaultStore
}

/**
* @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
*/
Plugins.propTypes = {
  'children': React.PropTypes.node,
  'store': PluginStore.type.isRequired
}
