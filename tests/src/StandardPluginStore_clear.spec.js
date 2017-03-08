/* eslint-env mocha */

import { expect } from 'chai'

export function StandardPluginStore_clear (createStore) {
  describe('#clear', function () {
    it('clear the store of its data', function () {
      let store = createStore().set('endpoints.first', 'azerty')
                               .set('endpoints.second', 5)
                               .set('endpoints.third.first', 6)

      expect(store.endpoints().length).to.be.equal(3)
      expect(store.clear().endpoints().length).to.be.equal(0)
    })

    it('is immutable', function () {
      let store = createStore().set('endpoints.first', 'azerty')
                               .set('endpoints.second', 5)
                               .set('endpoints.third.first', 6)

      expect(store.endpoints().length).to.be.equal(3)

      let updatedStore = store.clear()

      expect(updatedStore.endpoints().length).to.be.equal(0)
      expect(store.endpoints().length).to.be.equal(3)
    })
  }) // #clear
}
