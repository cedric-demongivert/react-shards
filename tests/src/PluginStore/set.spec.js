/* eslint-env mocha */

import { expect } from 'chai'

export function isPluginStoreSet (createStore) {
  it(
    'allow to set a value for an endpoint and to retrieve it',
    function () {
      let store = createStore().set('endpoints', 'azerty')
                               .set('endpoints.first', 2)
                               .set(['endpoints', 'second'], [1, 2, 3])

      expect(store.get('endpoints.first')).to.be.equal(2)
      expect(store.get(['endpoints', 'second'])).to.be.eql([1, 2, 3])
      expect(store.get(['endpoints'])).to.be.equal('azerty')
    }
  )

  it('must replace an existing value with another', function () {
    let store = createStore().set('test', 'lolcat')

    expect(store.get('test')).to.be.equal('lolcat')

    let updatedStore = store.set('test', 'loldog')

    expect(updatedStore.get('test')).to.be.equal('loldog')
  })

  it(
    ['must remove unused endpoints when an endpoint',
     'is set to a null-like value'].join(' '),
    function () {
      let store = createStore().set('endpoints.parent.child', 'lolcat')
                               .set('endpoints.other', 'other')
                               .set('endpoints.parent', 'loldog')

      expect(store.has('endpoints.parent.child')).to.be.true
      expect(store.has('endpoints.parent')).to.be.true
      expect(store.has('endpoints.other')).to.be.true

      let updatedStore = store.set('endpoints.parent', null)

      expect(updatedStore.has('endpoints.parent.child')).to.be.true
      expect(updatedStore.has('endpoints.parent')).to.be.false
      expect(updatedStore.has('endpoints.other')).to.be.true

      updatedStore = updatedStore.set('endpoints.parent.child', null)

      expect(updatedStore.has('endpoints.parent.child')).to.be.false
      expect(updatedStore.has('endpoints.parent')).to.be.false
      expect(updatedStore.has('endpoints.other')).to.be.true
    }
  )

  it('is immutable if was declared as immutable', function () {
    let firstStore = createStore()

    if (firstStore.isImmutable()) {
      let secondStore = firstStore.set('endpoints.second', 1)
      let thirdStore = firstStore.set('endpoints.third', 5)

      expect(firstStore.get('endpoints.second')).to.be.null
      expect(firstStore.get('endpoints.third')).to.be.null
      expect(secondStore.get('endpoints.second')).to.be.equal(1)
      expect(secondStore.get('endpoints.third')).to.be.null
      expect(thirdStore.get('endpoints.second')).to.be.null
      expect(thirdStore.get('endpoints.third')).to.be.equal(5)
      expect(thirdStore).to.not.equal(secondStore)
      expect(secondStore).to.not.equal(firstStore)
    }
  })

  it('is mutable if was declared as mutable', function () {
    let firstStore = createStore()

    if (!firstStore.isImmutable()) {
      let secondStore = firstStore.set('endpoints.second', 1)
      let thirdStore = firstStore.set('endpoints.third', 5)

      expect(firstStore.get('endpoints.second')).to.be.equal(1)
      expect(secondStore.get('endpoints.second')).to.be.equal(1)
      expect(thirdStore.get('endpoints.second')).to.be.equal(1)
      expect(firstStore.get('endpoints.third')).to.be.equal(5)
      expect(secondStore.get('endpoints.third')).to.be.equal(5)
      expect(thirdStore.get('endpoints.third')).to.be.equal(5)
    }
  })
}
