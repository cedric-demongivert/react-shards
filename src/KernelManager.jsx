import React from 'react'
import { Kernel } from './components/Kernel'

export class KernelManager {
  constructor (children) {
    this.kernel = null
    this.component = (
      <Kernel ref={(instance) => { this.kernel = instance }}>
        { children }
      </Kernel>
    )
  }

  plugin (path, component) {
    this.kernel.plugin(path, component)
  }

  plugout (path, component) {
    this.kernel.plugout(path, component)
  }

  getPlugged (path) {
    this.kernel.getPlugged(path)
  }

  hasPath (path) {
    this.kernel.hasPath(path)
  }

  getPaths () {
    this.kernel.getPaths()
  }
}
