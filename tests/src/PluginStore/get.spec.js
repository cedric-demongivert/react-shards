/* eslint-env mocha */

import { expect } from 'chai'

export function isPluginStoreGet (createStore) {
  let store = createStore().set('endpoints.first', 'azerty')
                           .set('endpoints.second', {'some': 2})
                           .set('endpoints.third', [1, 2, 3])

  it('return the value of an endpoint', function () {
    expect(store.get('endpoints')).to.be.null
    expect(store.get('endpoints.first')).to.be.equal('azerty')
    expect(store.get('endpoints.second')).to.be.eql({'some': 2})
    expect(store.get('endpoints.third')).to.be.eql([1, 2, 3])
  })

  it('is immutable', function () {
    let value = store.get('endpoints.third')

    expect(value).to.be.eql([1, 2, 3])
    value.push(4)
    expect(value).to.be.eql([1, 2, 3, 4])
    expect(store.get('endpoints.third')).to.be.eql([1, 2, 3])

    value = store.get('endpoints.second')

    expect(value).to.be.eql({'some': 2})
    value.other = 'other'
    expect(value).to.be.eql({'some': 2, 'other': 'other'})
    expect(store.get('endpoints.second')).to.be.eql({'some': 2})
  })

  it('return null for invalid endpoints', function () {
    expect(store.get('wazegaga')).to.be.null
  })
}
