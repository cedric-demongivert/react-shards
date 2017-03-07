import React from 'react'
import { assign } from 'lodash'

import { PluginStoreType } from '../types/PluginStoreType'

export const Namespaced = (BaseClass) => {
  let result = class extends BaseClass {
    getChildContext () {
      let base = {}

      if (super.getChildContext) {
        base = super.getChildContext()
      }

      base.kernel = this

      return base
    }
  }

  result.contextTypes = assign({}, BaseClass.contextTypes, {
    'pluginStore': PluginStoreType.isRequired
  })

  result.childContextTypes = assign({}, BaseClass.childContextTypes, {
    'pluginStore': PluginStoreType.isRequired
  })

  result.defaultProps = assign({}, BaseClass.defaultProps, {
    'absolute': false
  })

  result.propTypes = assign({}, BaseClass.propTypes, {
    'name': React.PropTypes.string.isRequired,
    'absolute': React.PropTypes.bool
  })

  return result
}
