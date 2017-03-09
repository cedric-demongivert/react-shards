/* eslint-env mocha */

import { expect } from 'chai'

export function isPluginStoreTypeHas (createStore) {
  let store = createStore().set('endpoints.first', 'azerty')
                           .set('endpoints.second', {'some': 2})
                           .set('endpoints.third', [1, 2, 3])

  it('return true for used endpoints', function () {
    expect(store.has('endpoints.first')).to.be.true
    expect(store.has('endpoints.second')).to.be.true
    expect(store.has('endpoints.third')).to.be.true
  })

  it('return false for unused endpoints', function () {
    expect(store.has('endpoints')).to.be.false
  })

  it('return false for invalid endpoints', function () {
    expect(store.has('wazegaga')).to.be.false
  })
}
