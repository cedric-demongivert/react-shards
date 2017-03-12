import React from 'react'
import { assign } from 'lodash'

/**
* @decorator
*/
export const BasicPluginRenderer = (BaseClass) => {
  let result = class extends BaseClass {
    map (plugins) {
      if (this.props.map) {
        if (Array.isArray(plugins)) {
          return plugins.map(this.props.map)
        } else {
          return this.props.map(plugins, 0, [plugins])
        }
      } else {
        return plugins
      }
    }

    sort (plugins) {
      if (this.props.sort) {
        if (Array.isArray(plugins)) {
          return this.props.sort(plugins)
        } else {
          return plugins
        }
      } else {
        return plugins
      }
    }

    render () {
      if (this.props.custom != null) {
        return this.renderPlugins(this.props.custom(this.get()))
      } else if (this.props.policy === 'sort and map') {
        let plugins = this.sort(this.map(this.get()))
        return this.renderPlugins(plugins)
      } else {
        let plugins = this.map(this.sort(this.get()))
        return this.renderPlugins(plugins)
      }
    }
  }

  /**
  * @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
  */
  result.defaultProps = assign({}, {
    'children': null,
    'mapper': null,
    'sorter': null,
    'policy': 'map and sort',
    'custom': null
  }, BaseClass.defaultProps)

  /**
  * @see https://facebook.github.io/react/docs/typechecking-with-proptypes.html
  */
  result.propTypes = assign({}, {
    'children': React.PropTypes.element,
    'map': React.PropTypes.func,
    'sort': React.PropTypes.func,
    'custom': React.PropTypes.func,
    'policy': React.PropTypes.oneOf([
      'sort and map',
      'map and sort'
    ])
  }, BaseClass.propTypes)

  return result
}
