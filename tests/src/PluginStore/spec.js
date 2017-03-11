/* eslint-env mocha */

import { isPluginStoreClear } from './clear.spec'
import { isPluginStoreDelete } from './delete.spec'
import { isPluginStoreEndpoints } from './endpoints.spec'
import { isPluginStoreFilter } from './filter.spec'
import { isPluginStoreGet } from './get.spec'
import { isPluginStoreHas } from './has.spec'
import { isPluginStorePush } from './push.spec'
import { isPluginStoreSet } from './set.spec'
import { isPluginStoreSnapshot } from './snapshot.spec'
import { isPluginStoreOnChange } from './onChange.spec'

import { expect } from 'chai'

export function isPluginStore (createStore) {
  it('must be instanciable', function () {
    let store = createStore()
    expect(store).to.not.be.null
  })

  let suite = {
    '#clear': isPluginStoreClear,
    '#delete': isPluginStoreDelete,
    '#endpoints': isPluginStoreEndpoints,
    '#filter': isPluginStoreFilter,
    '#get': isPluginStoreGet,
    '#has': isPluginStoreHas,
    '#push': isPluginStorePush,
    '#set': isPluginStoreSet,
    '#snapshot': isPluginStoreSnapshot,
    '#onChange': isPluginStoreOnChange
  }

  for (let methodName in suite) {
    describe(methodName, function () {
      suite[methodName](createStore)
    })
  }
}
