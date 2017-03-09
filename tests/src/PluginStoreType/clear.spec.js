/* eslint-env mocha */

import { expect } from 'chai'

export function isPluginStoreTypeClear (createStore) {
  it('clear the store of its data', function () {
    let store = createStore().set('endpoints.first', 'azerty')
                             .set('endpoints.second', 5)
                             .set('endpoints.third.first', 6)

    expect(store.endpoints().length).to.be.equal(3)
    expect(store.clear().endpoints().length).to.be.equal(0)
  })

  it('remove all data from a specific endpoint', function () {
    let store = createStore().set('endpoints.first', 'azerty')
                             .set('endpoints.second', 5)
                             .set('endpoints.third.first', 6)
                             .set('endpoints.third.second', 4)
                             .set('endpoints.third.third', 2)
                             .set('endpoints.third', 1)

    expect(store.endpoints().length).to.be.equal(6)

    let final = store.clear('endpoints.third').endpoints()

    for (let endpoint of [
      'endpoints.first',
      'endpoints.second'
    ]) {
      expect(final.indexOf(endpoint)).to.not.equal(-1)
    }
  })

  it('is immutable if was declared as immutable', function () {
    let store = createStore()

    if (store.isImmutable()) {
      store = store.set('endpoints.first', 'azerty')
                   .set('endpoints.second', 5)
                   .set('endpoints.third.first', 6)

      expect(store.endpoints().length).to.be.equal(3)

      let updatedStore = store.clear()

      expect(updatedStore.endpoints().length).to.be.equal(0)
      expect(store.endpoints().length).to.be.equal(3)
    }
  })

  it('is mutable if was declared as mutable', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      store.set('endpoints.first', 'azerty')
           .set('endpoints.second', 5)
           .set('endpoints.third.first', 6)

      expect(store.endpoints().length).to.be.equal(3)

      let updatedStore = store.clear()

      expect(updatedStore.endpoints().length).to.be.equal(0)
      expect(store.endpoints().length).to.be.equal(0)
    }
  })
}
