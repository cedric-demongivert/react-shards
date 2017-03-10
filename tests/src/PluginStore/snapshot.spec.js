/* eslint-env mocha */

import { expect } from 'chai'

export function isPluginStoreSnapshot (createStore) {
  let baseValues = {
    'endpoints': 'azerty',
    'endpoints.first': 2,
    'endpoints.second': [1, 2, 3]
  }

  let store = createStore()

  for (let endpoint in baseValues) {
    store = store.set(endpoint, baseValues[endpoint])
  }

  it(
    'return a copy of the current store',
    function () {
      let snapshot = store.snapshot()
      let snapshotEndpoints = snapshot.endpoints()

      expect(snapshotEndpoints.length).to.be.equal(3)

      for (let endpoint in baseValues) {
        expect(snapshotEndpoints.indexOf(endpoint)).to.not.equal(-1)
        expect(snapshot.get(endpoint)).to.be.eql(baseValues[endpoint])
      }
    }
  )

  it(
    'return an immutable store',
    function () {
      let snapshot = store.snapshot()

      store = store.set('endpoints.first', 'blouga')

      expect(snapshot.isImmutable()).to.be.true

      expect(store.get('endpoints.first')).to.be.equal('blouga')
      expect(snapshot.get('endpoints.first')).to.be.equal(2)

      let otherState = snapshot.set('endpoints', 'blouga')

      expect(otherState.get('endpoints')).to.be.equal('blouga')
      expect(snapshot.get('endpoints')).to.be.equal('azerty')
    }
  )
}
