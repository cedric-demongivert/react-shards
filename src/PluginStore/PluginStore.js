import { ImmutablePluginStore } from './ImmutablePluginStore'
import { SubPluginStore } from './SubPluginStore'
import Endpoints from './Endpoints'

/**
* @class PluginStore
*
* A simple mutable PluginStoreType implementation.
*/
export class PluginStore {
  /**
  * Create a new empty store.
  *
  * @param {PluginStoreType} [toCopy=null] - Store to copy.
  */
  constructor () {
    this.state = new ImmutablePluginStore()
    this.listeners = {}
    this.rootListeners = []
  }

  /**
  * @see PluginStoreType.get
  */
  get (...params) {
    return this.state.get(...params)
  }

  /**
  * @see PluginStoreType.push
  */
  push (...params) {
    this.state = this.state.push(...params)
    return this
  }

  /**
  * @see PluginStoreType.delete
  */
  delete (...params) {
    this.state = this.state.delete(...params)
    return this
  }

  /**
  * @see PluginStoreType.set
  */
  set (...params) {
    this.state = this.state.set(...params)
    return this
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (...params) {
    this.state = this.state.filter(...params)
    return this
  }

  /**
  * @see PluginStoreType.endpoints
  */
  endpoints (...params) {
    return this.state.endpoints(...params)
  }

  /**
  * @see PluginStoreType.has
  */
  has (...params) {
    return this.state.has(...params)
  }

  /**
  * @see PluginStoreType.clear
  */
  clear (...params) {
    this.state = this.state.clear(...params)
    return this
  }

  /**
  * @see PluginStoreType.absolute
  */
  absolute () {
    return this
  }

  /**
  * @see PluginStoreType.absolute
  */
  snapshot (...params) {
    return this.state.snapshot(...params)
  }

  /**
  * @see PluginStoreType.onChange
  */
  onChange (endpoint, callback) {
    let identifier = Endpoint.identifierToString(endpoint)

    if (identifier == null) {
      this.rootListeners.push(callback)
      return () => {
        this.rootListeners = this.rootListeners.filter((x) => x !== callback)
      }
    } else {
      let listeners = this.listeners[endpoint] || []
      listeners.push(callback)
      this.listeners[endpoint] = listeners
      return () => {
        this.listeners[endpoint] = this.listeners[endpoint].filter(
          (x) => x !== callback
        )

        if (this.listeners[endpoint].length === 0) {
          delete this.listeners[endpoint]
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
      if (endpoint.indexOf(subEndpoint) == 0) {
        let substore = new SubPluginStore(this, subEndpoint)
        let updated = Endpoints.identifierToArray(
          stringIdentifier.substring(subEndpoint.length + 1)
        )
        for (let listener of this.listeners[subEndpoint]) {
          listener(substore, updated)
        }
      }
    }
  }

  /**
  * @see PluginStoreType.isImmutable
  */
  isImmutable () {
    return false
  }
}
