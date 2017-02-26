import React from 'react'
import { Map, List } from 'immutable'

import { Kernel } from './components/Kernel'

export class KernelManager {
  constructor (children) {
    this.pluginBase = new Map()

    this.kernel = null
    this.component = (
      <Kernel ref={this.initialize.bind(this)}>
        { children }
      </Kernel>
    )
  }

  initialize (kernel) {
    for (let key of this.pluginBase.keys()) {
      let pluggeds = this.pluginBase.get(key)
      for (let plugged of pluggeds.values()) {
        kernel.plugin(key, plugged)
      }
    }

    this.kernel = kernel
  }

  plugin (path, component) {
    if (this.kernel) {
      this.kernel.plugin(path, component)
    }

    if (!this.pluginBase.has(path)) {
      this.pluginBase = this.pluginBase.set(path, new List())
    }

    this.pluginBase = this.pluginBase.set(
      path, this.pluginBase.get(path).push(component)
    )
  }

  plugout (path, component) {
    if (this.kernel) {
      this.kernel.plugout(path, component)
    }

    if (!this.pluginBase.has(path)) {
      throw new Error([
        'Unable to plugout a component : the endpoint "' + path,
        '" doesn\'t exists in the kernel. Do you trying to plugout a ',
        'component that was not previously plugged ?'
      ].join(''))
    }

    let plugged = this.pluginBase.get(path)
    let removeIndex = plugged.findIndex((x) => x === component)

    if (removeIndex <= -1) {
      throw new Error([
        'Unable to plugout a component : the searched component was not ',
        ' previously plugged to the endpoint "' + path + '".'
      ].join(''))
    }

    this.pluginBase = this.pluginBase.set(path, plugged.delete(removeIndex))

    if (this.pluginBase.get(path).size <= 0) {
      this.pluginBase = this.pluginBase.delete(path)
    }
  }

  getPlugged (path) {
    if (this.kernel) {
      return this.kernel.getPlugged(path)
    }

    let plugged = this.pluginBase.get(path)

    if (plugged != null) {
      return plugged.toJS()
    } else {
      return []
    }
  }

  hasPath (path) {
    if (this.kernel) {
      return this.kernel.hasPath(path)
    }

    return this.pluginBase.has(path)
  }

  getPaths () {
    if (this.kernel) {
      return this.kernel.getPaths()
    }

    return this.pluginBase.keySeq().toList().toJS()
  }
}
