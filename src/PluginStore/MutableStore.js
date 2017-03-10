import { ImmutableStore } from './ImmutableStore'
import { SubStore } from './SubStore'
import Endpoints from './Endpoints'

/**
* @class MutableStore
*
* A simple mutable PluginStore.type implementation.
*/
export class MutableStore {
  /**
  * Create a new empty store.
  *
  * @param {PluginStore.type} [toCopy=null] - Store to copy.
  */
  constructor () {
    this.state = new ImmutableStore()
    this.listeners = {}
    this.rootListeners = []
  }

  /**
  * @see PluginStore.type.get
  */
  get (...params) {
    return this.state.get(...params)
  }

  /**
  * @see PluginStore.type.push
  */
  push (...params) {
    this.state = this.state.push(...params)
    this._triggerChange(params[0])
    return this
  }

  /**
  * @see PluginStore.type.delete
  */
  delete (...params) {
    this.state = this.state.delete(...params)
    this._triggerChange(params[0])
    return this
  }

  /**
  * @see PluginStore.type.set
  */
  set (...params) {
    this.state = this.state.set(...params)
    this._triggerChange(params[0])
    return this
  }

  /**
  * @see PluginStore.type.filter
  */
  filter (...params) {
    this.state = this.state.filter(...params)
    this._triggerChange(params[0])
    return this
  }

  /**
  * @see PluginStore.type.endpoints
  */
  endpoints (...params) {
    return this.state.endpoints(...params)
  }

  /**
  * @see PluginStore.type.has
  */
  has (...params) {
    return this.state.has(...params)
  }

  /**
  * @see PluginStore.type.clear
  */
  clear (...params) {
    this.state = this.state.clear(...params)
    this._triggerChange(params[0])
    return this
  }

  /**
  * @see PluginStore.type.absolute
  */
  absolute () {
    return this
  }

  /**
  * @see PluginStore.type.absolute
  */
  snapshot (...params) {
    return this.state.snapshot(...params)
  }

  /**
  * @see PluginStore.type.onChange
  */
  onChange (endpoint, callback) {
    let identifier = Endpoints.identifierToString(endpoint)

    if (identifier == null) {
      this.rootListeners.push(callback)
      return () => {
        this.rootListeners = this.rootListeners.filter((x) => x !== callback)
      }
    } else {
      let listeners = this.listeners[identifier] || []
      listeners.push(callback)
      this.listeners[identifier] = listeners
      return () => {
        this.listeners[identifier] = this.listeners[identifier].filter(
          (x) => x !== callback
        )

        if (this.listeners[identifier].length === 0) {
          delete this.listeners[identifier]
        }
      }
    }
  }

  /**
  * Call listeners if necessary.
  *
  * @param {String|Array<String>} endpoint
  */
  _triggerChange (endpoint) {
    let stringIdentifier = Endpoints.identifierToString(endpoint)
    let arrayIdentifier = Endpoints.identifierToArray(endpoint)
    for (let listener of this.rootListeners) {
      listener(this, arrayIdentifier)
    }

    for (let subEndpoint in this.listeners) {
      if (
        subEndpoint.length < stringIdentifier.length &&
        stringIdentifier.indexOf(subEndpoint) == 0
      ) {
        let substore = new SubStore(this, subEndpoint)
        let subIdentifier = Endpoints.identifierToArray(
          stringIdentifier.substring(subEndpoint.length + 1)
        )
        for (let listener of this.listeners[subEndpoint]) {
          listener(substore, subIdentifier)
        }
      }
    }
  }

  /**
  * @see PluginStore.type.isImmutable
  */
  isImmutable () {
    return false
  }
}
