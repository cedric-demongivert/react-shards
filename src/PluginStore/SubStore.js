import Endpoints from './Endpoints'

/**
* @class SubStore
*
* A PluginStore that is a subset of another PluginStore.
*/
export class SubStore {
  /**
  * Create a new SubStore from another store.
  *
  * @param {PluginStore.type} parentStore - Parent store.
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
      return new SubStore(newParentStore, this.rootEndpoint)
    } else {
      this.parentStore[name](endpoint, ...params)
      return this
    }
  }

  /**
  * @see PluginStore.type.get
  */
  get (endpoint = []) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.get(endpoint)
  }

  /**
  * @see PluginStore.type.push
  */
  push (endpoint = [], ...values) {
    return this._delegate('push', endpoint, ...values)
  }

  /**
  * @see PluginStore.type.delete
  */
  delete (endpoint = [], ...values) {
    return this._delegate('delete', endpoint, ...values)
  }

  /**
  * @see PluginStore.type.set
  */
  set (endpoint = [], value) {
    return this._delegate('set', endpoint, value)
  }

  /**
  * @see PluginStore.type.filter
  */
  filter (endpoint = [], predicate) {
    return this._delegate('filter', endpoint, predicate)
  }

  /**
  * @see PluginStore.type.endpoints
  */
  endpoints (endpoint = []) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.endpoints(endpoint)
  }

  /**
  * @see PluginStore.type.has
  */
  has (endpoint = []) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.has(endpoint)
  }

  /**
  * @see PluginStore.type.clear
  */
  clear (endpoint = []) {
    return this._delegate('clear', endpoint)
  }

  /**
  * @see PluginStore.type.absolute
  */
  absolute () {
    return this.parentStore
  }

  /**
  * @see PluginStore.type.snapshot
  */
  snapshot (endpoint) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.snapshot(endpoint)
  }

  /**
  * @see PluginStore.type.onChange
  */
  onChange (endpoint = [], callback) {
    endpoint = this.rootEndpoint.concat(Endpoints.identifierToArray(endpoint))
    return this.parentStore.onChange(endpoint, callback)
  }

  /**
  * @see PluginStore.type.isImmutable
  */
  isImmutable () {
    return this.parentStore.isImmutable()
  }
}
