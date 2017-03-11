/**
* @class MirrorStore
*
* Duplicate all writing calls to another store object.
*/
export class MirrorStore {
  /**
  * Create a new MirrorStore from another store.
  *
  * @param {Object} options - Configure the mirror.
  *
  * options must contains :
  *   - parent : {PluginStore.type} Base store used by the mirror.
  *   - reflected : {PluginStore.type} Store used to reflect writing calls.
  */
  constructor (options) {
    this.parentStore = options.parent
    this.reflected = options.reflected
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
    this.reflected[name](endpoint, ...params)
    if (this.parentStore.isImmutable()) {
      let newParentStore = this.parentStore[name](endpoint, ...params)
      return new MirrorStore({
        parent: newParentStore,
        reflected: this.reflected
      })
    } else {
      this.parentStore[name](endpoint, ...params)
      return this
    }
  }

  /**
  * @see PluginStore.type.get
  */
  get (...params) {
    return this.parentStore.get(...params)
  }

  /**
  * @see PluginStore.type.push
  */
  push (...params) {
    return this._delegate('push', ...params)
  }

  /**
  * @see PluginStore.type.delete
  */
  delete (...params) {
    return this._delegate('delete', ...params)
  }

  /**
  * @see PluginStore.type.set
  */
  set (...params) {
    return this._delegate('set', ...params)
  }

  /**
  * @see PluginStore.type.filter
  */
  filter (...params) {
    return this._delegate('filter', ...params)
  }

  /**
  * @see PluginStore.type.endpoints
  */
  endpoints (...params) {
    return this.parentStore.endpoints(...params)
  }

  /**
  * @see PluginStore.type.has
  */
  has (...params) {
    return this.parentStore.has(...params)
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
  absolute (...params) {
    return this.parentStore.absolute(...params)
  }

  /**
  * @see PluginStore.type.snapshot
  */
  snapshot (...params) {
    return this.parentStore.snapshot(...params)
  }

  /**
  * @see PluginStore.type.onChange
  */
  onChange (...params) {
    return this.parentStore.onChange(...params)
  }

  /**
  * @see PluginStore.type.isImmutable
  */
  isImmutable () {
    return this.parentStore.isImmutable()
  }
}
