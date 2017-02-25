import React from 'react'
import { assign } from 'lodash'

import { Kernel } from './Kernel'

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

    plugin (path, component, scoped = true) {
      if (scoped) {
        return this.context.kernel.plugin(
          this.props.name + '.' + path, component, scoped
        )
      } else {
        return this.context.kernel.plugin(path, component, scoped)
      }
    }

    plugout (path, component, scoped = true) {
      if (scoped) {
        return this.context.kernel.plugout(
          this.props.name + '.' + path, component, scoped
        )
      } else {
        return this.context.kernel.plugout(path, component, scoped)
      }
    }

    getPlugged (path, scoped = true) {
      if (scoped) {
        return this.context.kernel.getPlugged(
          this.props.name + '.' + path, scoped
        )
      } else {
        return this.context.kernel.getPlugged(path, scoped)
      }
    }

    hasPath (path, scoped = true) {
      if (scoped) {
        return this.context.kernel.hasPath(
          this.props.name + '.' + path, scoped
        )
      } else {
        return this.context.kernel.hasPath(path, scoped)
      }
    }

    getPaths (scoped = true) {
      if (scoped) {
        return this.context.kernel.getPaths().filter(
                (x) => {
                  return x.indexOf(this.props.name + '.') === 0 ||
                         x === this.props.name
                }
              ).map(
                (x) => {
                  if (x === this.props.name) {
                    return this.props.name
                  } else {
                    return x.substring(this.props.name.length + 1)
                  }
                }
              )
      } else {
        return this.context.kernel.getPaths()
      }
    }
  }

  result.contextTypes = assign({}, BaseClass.contextTypes, {
    'kernel': Kernel.type.isRequired
  })

  result.childContextTypes = assign({}, BaseClass.childContextTypes, {
    'kernel': Kernel.type.isRequired
  })

  result.defaultProps = assign({}, BaseClass.defaultProps, {
    'children': null
  })

  result.propTypes = assign({}, BaseClass.propTypes, {
    'name': React.PropTypes.string.isRequired
  })

  return result
}
