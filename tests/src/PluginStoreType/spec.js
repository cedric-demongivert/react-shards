import { isPluginStoreTypeClear } from './clear.spec'
import { isPluginStoreTypeDelete } from './delete.spec'
import { isPluginStoreTypeEndpoints } from './endpoints.spec'
import { isPluginStoreTypeFilter } from './filter.spec'
import { isPluginStoreTypeGet } from './get.spec'
import { isPluginStoreTypeHas } from './has.spec'
import { isPluginStoreTypePush } from './push.spec'
import { isPluginStoreTypeSet } from './set.spec'
import { isPluginStoreTypeSnapshot } from './snapshot.spec'
import { isPluginStoreTypeOnChange } from './onChange.spec'

import { expect } from 'chai'

export function isPluginStoreType (createStore) {
  it('must be instanciable', function () {
    let store = createStore()
    expect(store).to.not.be.null
  })

  let suite = {
    '#clear': isPluginStoreTypeClear,
    '#delete': isPluginStoreTypeDelete,
    '#endpoints': isPluginStoreTypeEndpoints,
    '#filter': isPluginStoreTypeFilter,
    '#get': isPluginStoreTypeGet,
    '#has': isPluginStoreTypeHas,
    '#push': isPluginStoreTypePush,
    '#set': isPluginStoreTypeSet,
    '#snapshot': isPluginStoreTypeSnapshot,
    '#onChange': isPluginStoreTypeOnChange
  }

  for (let methodName in suite) {
    describe(methodName, function() {
      suite[methodName](createStore)
    })
  }
}
