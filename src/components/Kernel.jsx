import React, { Component } from 'react'
import { Map, List } from 'immutable'

/**
* @component <Kernel />
*
* A plugin database. Access it with the 'kernel' context type.
*/
export class Kernel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      'pluginBase': new Map()
    }
  }

  getChildContext () {
    return {
      'kernel': this
    }
  }

  plugin (path, component) {
    this.setState(({ pluginBase }) => {
      let nextPluginBase = pluginBase
      if (!nextPluginBase.has(path)) {
        nextPluginBase = nextPluginBase.set(path, new List())
      }

      nextPluginBase = nextPluginBase.set(
        path, nextPluginBase.get(path).push(component)
      )

      return { 'pluginBase': nextPluginBase }
    })
  }

  plugout (path, component) {
    this.setState(({ pluginBase }) => {
      let nextPluginBase = pluginBase

      if (!nextPluginBase.has(path)) {
        throw new Error([
          'Unable to plugout a component : the endpoint "' + path,
          '" doesn\'t exists in the kernel. Do you trying to plugout a ',
          'component that was not previously plugged ?'
        ].join(''))
      }

      let plugged = nextPluginBase.get(path)
      let removeIndex = plugged.findIndex((x) => x === component)

      if (removeIndex <= -1) {
        throw new Error([
          'Unable to plugout a component : the searched component was not ',
          ' previously plugged to the endpoint "' + path + '".'
        ].join(''))
      }

      nextPluginBase = nextPluginBase.set(path, plugged.delete(removeIndex))

      if (nextPluginBase.get(path).size <= 0) {
        nextPluginBase = nextPluginBase.delete(path)
      }

      return { 'pluginBase': nextPluginBase }
    })
  }

  getPlugged (path) {
    let plugged = this.state.pluginBase.get(path)

    if (plugged != null) {
      return plugged.toJS()
    } else {
      return []
    }
  }

  hasPath (path) {
    return this.state.pluginBase.has(path)
  }

  getPaths () {
    return this.state.pluginBase.keySeq().toList().toJS()
  }

  render () {
    return this.props.children
  }
}

Kernel.type = React.PropTypes.shape({
  'plugin': React.PropTypes.func.isRequired,
  'plugout': React.PropTypes.func.isRequired,
  'getPlugged': React.PropTypes.func.isRequired,
  'getPaths': React.PropTypes.func.isRequired,
  'hasPath': React.PropTypes.func.isRequired
})

Kernel.childContextTypes = {
  'kernel': Kernel.type.isRequired
}

Kernel.defaultProps = {
  'children': null
}

Kernel.propTypes = {
  'children': React.PropTypes.node
}
