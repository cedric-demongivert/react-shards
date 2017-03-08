/* eslint-env mocha */

import { expect } from 'chai'

import { StandardPluginStore_clear } from './StandardPluginStore_clear.spec'
import { StandardPluginStore_delete } from './StandardPluginStore_delete.spec'
import {
  StandardPluginStore_endpoints
} from './StandardPluginStore_endpoints.spec'
import { StandardPluginStore_filter } from './StandardPluginStore_filter.spec'
import { StandardPluginStore_get } from './StandardPluginStore_get.spec'
import { StandardPluginStore_has } from './StandardPluginStore_has.spec'
import { StandardPluginStore_push } from './StandardPluginStore_push.spec'
import { StandardPluginStore_set } from './StandardPluginStore_set.spec'

export function StandardPluginStore (StoreClassName, createStore) {
  describe(StoreClassName, function () {
    it('must be instanciable', function () {
      let store = createStore()
      expect(store).to.not.be.null
    })

    StandardPluginStore_clear(createStore)
    StandardPluginStore_delete(createStore)
    StandardPluginStore_endpoints(createStore)
    StandardPluginStore_filter(createStore)
    StandardPluginStore_get(createStore)
    StandardPluginStore_has(createStore)
    StandardPluginStore_push(createStore)
    StandardPluginStore_set(createStore)
  })
}
