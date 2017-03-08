import React, { Component } from 'react'

import { pluginStores } from '../pluginStores'
import { PluginStoreType } from '../types/PluginStoreType'

export class Inherit extends Component {
  render () {
    return this.props.children
  }
}

/**
* @see https://facebook.github.io/react/docs/context.html
*/
result.contextTypes = {
  'pluginStore': PluginStoreType
}

/**
* @see https://facebook.github.io/react/docs/context.html
*/
Inherit.childContextTypes = {
  'pluginStore': PluginStoreType.isRequired
}

/**
* @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
*/
Inherit.defaultProps = {
  'children': null,
  'from': pluginStores
}

/**
* @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
*/
Inherit.propTypes = {
  'children': React.PropTypes.node,
  'from': React.PropTypes.any.isRequired,
  'name': React.PropTypes.string.isRequired
}
