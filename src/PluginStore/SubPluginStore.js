import Endpoints from './Endpoints'

/**
* @class SubPluginStore
*
* A PluginStore that is a subset of another PluginStore.
*/
export class SubPluginStore {
  /**
  * Create a new SubPluginStore from another store.
  *
  * @param {PluginStoreType} parentStore - Parent store.
  * @param {String, Array<String>} rootEndpoint - Root endpoint of this store in the parent.
  */
  constructor (parentStore, rootEndpoint) {
    this.parentStore = parentStore
    this.rootEndpoint = Endpoints.identifierToArray(rootEndpoint)
  }

  /**
  * Call a parent store method, and return the right value.
  *
  * @param {String} name - Name of the method to call.
  * @param {String|Array<String>} endpoint - Endpoint to change.
  * @param {Array<any>} [...params=undefined] - Other params
  *
  * @return {any} The result of the call.
  */
  _delegate (name, endpoint, ...params) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    if (this.parentStore.isImmutable()) {
      let newParentStore = this.parentStore[name](endpoint, ...params)
      return new SubPluginStore(newParentStore, this.rootEndpoint)
    } else {
      this.parentStore[name](endpoint, ...params)
      return this
    }
  }

  /**
  * @see PluginStoreType.get
  */
  get (endpoint = []) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.get(endpoint)
  }

  /**
  * @see PluginStoreType.push
  */
  push (endpoint = [], ...values) {
    return this._delegate('push', endpoint, ...values)
  }

  /**
  * @see PluginStoreType.delete
  */
  delete (endpoint = [], ...values) {
    return this._delegate('delete', endpoint, ...values)
  }

  /**
  * @see PluginStoreType.set
  */
  set (endpoint = [], value) {
    return this._delegate('set', endpoint, value)
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (endpoint = [], predicate) {
    return this._delegate('filter', endpoint, predicate)
  }

  /**
  * @see PluginStoreType.endpoints
  */
  endpoints (endpoint = []) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.endpoints(endpoint)
  }

  /**
  * @see PluginStoreType.has
  */
  has (endpoint = []) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.has(endpoint)
  }

  /**
  * @see PluginStoreType.clear
  */
  clear (endpoint = []) {
    return this._delegate('clear', endpoint)
  }

  /**
  * @see PluginStoreType.absolute
  */
  absolute () {
    return this.parentStore
  }

  /**
  * @see PluginStoreType.snapshot
  */
  snapshot (endpoint) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.rootEndpoint.snapshot(endpoint)
  }

  /**
  * @see PluginStoreType.onChange
  */
  onChange (endpoint = [], callback) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.onChange(callback)
  }

  /**
  * @see PluginStoreType.isImmutable
  */
  isImmutable () {
    return this.parentStore.isImmutable()
  }
}
