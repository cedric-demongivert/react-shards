import { Map, List } from 'immutable'
import { isString } from 'lodash'

export class PluginStore {
  constructor (value = null, children = new Map()) {
    if (Map.isMap(children)) {
      this.children = children
    } else {
      this.children = new Map(children)
    }

    this.value = value
  }

  /**
  * Return a sub-store of this store.
  *
  * @param {Array|String} path - Name of the store to get.
  *
  * @return {PluginStore} The sub-store.
  */
  getStore (path = []) {
    if (isString(path)) {
      path = path.split('.')
    }

    let store = this

    for (let index = 0; index < path.length; ++index) {
      if (store.children.has(path[index])) {
        store = store.children.get(path[index])
      } else {
        this._throwUnnableToGetStoreError(path, index)
      }
    }

    return store
  }

  setStore(path = [], newStore) {
    if (isString(path)) {
      path = path.split('.')
    }

    let stack = []
  }

  _throwUnnableToGetStoreError(path, index) {
    throw new Error([
      `Unnable to get sub-store "${path[index]}" of path "${path.join('.')}" :`,
      `the store "${path[index]}" is not a child of`,
      path.slice(0, index).join('.')
    ].join(' '))
  }

  /**
  * Return a stored value.
  *
  * @param {Array|String} path - Name of the value to get.
  *
  * @return {any} The registered value.
  */
  get(path = []) {
    return this.getStore(path).value
  }


  plugin (path = [], ...values) {


    let nextState = this.state

    return new PluginStore(nextState)
  }

}
