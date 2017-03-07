import { PluginStore } from './PluginStore'

export class PluginStoreManager
{
  constructor () {
    this._listeners = {}
    this._proxy = {}
  }

  get (name, factory = () => new PluginStore()) {
    if (name in this._proxy) {
      return this._proxy[name]
    } else {
      let proxy = new PluginStoreProxy(this, name, factory)
      this._proxy[name] = proxy
      return proxy
    }
  }

  clear (name) {

  }

  _triggerChange (name, old, updated) {
    for (let listener of this._listeners[name] || []) {
      listener(old, updated)
    }
  }

  registerOnChange (name, callback) {
    if (name in this._listeners) {
      this._listeners[name].push(callback)
    } else {
      this._listeners[name] = [callback]
    }
  }

  unregisterOnChange (name, callback) {
    if (name in this._listeners) {
      let result = this._listeners[name]
      result = result.filter((element) => element !== callback)
      if (result.length > 0) {
        this._listeners[name] = result
      } else {
        delete this._listeners[name]
      }
    }
  }
}


class PluginStoreProxy
{
  constructor (manager, name, factory) {
    this._manager = manager
    this._name = name
    this._repository = factory()
  }

  snapshot () {
    return this._repository
  }

  /**
  * @see PluginStoreType.push
  */
  push (... params) {
    let old = this._repository
    this._repository = old.push(... params)

    this._manager._triggerChange(name, old, this._repository)
    return this
  }

  /**
  * @see PluginStoreType.delete
  */
  delete (... params) {
    let old = this._repository
    this._repository = old.delete(... params)

    this._manager._triggerChange(name, old, this._repository)
    return this
  }

  /**
  * @see PluginStoreType.filter
  */
  filter (... params) {
    let old = this._repository
    this._repository = old.filter(... params)

    this._manager._triggerChange(name, old, this._repository)
    return this
  }

  /**
  * @see PluginStoreType.get
  */
  get (... params) {
    return this._repository.get(... params)
  }

  /**
  * @see PluginStoreType.set
  */
  set (... params) {
    let old = this._repository
    this._repository = old.set(... params)

    this._manager._triggerChange(name, old, this._repository)
    return this
  }

  /**
  * @see PluginStoreType.endpoints
  */
  endpoints (... params) {
    return this._repository.endpoints(... params)
  }

  /**
  * @see PluginStoreType.has
  */
  has (... params) {
    return this._repository.has(... params)
  }

  /**
  * @see PluginStoreType.clear
  */
  clear (... params) {
    let old = this._repository
    this._repository = old.clear(... params)

    this._manager._triggerChange(name, old, this._repository)
    return this
  }
}
