/* eslint-env mocha */

import { expect } from 'chai'

export function StandardPluginStore_endpoints (createStore) {
  describe('#endpoints', function () {
    it('return a list of used endpoints', function () {
      let store = createStore().set('endpoints.first', 'azerty')
                               .set('endpoints.second', 5)
                               .set('endpoints.third.first', 6)
                               .set('endpoints', 8)
                               .set('other', 5)

      let endpoints = store.endpoints()
      expect(endpoints.length).to.be.equal(5)
      for (let endpoint of [
        'endpoints.first',
        'endpoints.second',
        'endpoints.third.first',
        'endpoints',
        'other'
      ]) {
        expect(endpoints.indexOf(endpoint)).to.not.equal(-1)
      }
    })

    it('can return a subset of used endpoints', function () {
      let store = createStore().set('endpoints.first', 'azerty')
                               .set('endpoints.second', 5)
                               .set('endpoints.third.first', 6)
                               .set('endpoints.third.second', 5)
                               .set('endpoints.third.third.first', 5)
                               .set('endpoints.third', 8)
                               .set('other', 5)

     let endpoints = store.endpoints('endpoints.third')
     expect(endpoints.length).to.be.equal(4)
     for (let endpoint of [
       'first',
       'second',
       'third.first',
       null
     ]) {
       expect(endpoints.indexOf(endpoint)).to.not.equal(-1)
     }
    })

    it('return an empty array if the store is empty', function () {
      let store = createStore()

      expect(store.endpoints()).to.be.eql([])
    })
  }) // #endpoints
}
