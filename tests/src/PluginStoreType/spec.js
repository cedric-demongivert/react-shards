import { isPluginStoreTypeClear } from './clear.spec'
import { isPluginStoreTypeDelete } from './delete.spec'
import { isPluginStoreTypeEndpoints } from './endpoints.spec'
import { isPluginStoreTypeFilter } from './filter.spec'
import { isPluginStoreTypeGet } from './get.spec'
import { isPluginStoreTypeHas } from './has.spec'
import { isPluginStoreTypePush } from './push.spec'
import { isPluginStoreTypeSet } from './set.spec'

import { expect } from 'chai'

export function isPluginStoreType (createStore) {
  it('must be instanciable', function () {
    let store = createStore()
    expect(store).to.not.be.null
  })

  describe('#clear', function () {
    isPluginStoreTypeClear(createStore)
  })

  describe('#delete', function () {
    isPluginStoreTypeDelete(createStore)
  })

  describe('#endpoints', function () {
    isPluginStoreTypeEndpoints(createStore)
  })

  describe('#filter', function () {
    isPluginStoreTypeFilter(createStore)
  })

  describe('#get', function () {
    isPluginStoreTypeGet(createStore)
  })

  describe('#has', function () {
    isPluginStoreTypeHas(createStore)
  })

  describe('#push', function () {
    isPluginStoreTypePush(createStore)
  })

  describe('#set', function () {
    isPluginStoreTypeSet(createStore)
  })
}
