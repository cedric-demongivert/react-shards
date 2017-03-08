/* eslint-env mocha */

import { expect } from 'chai'

export function StandardPluginStore_delete (createStore) {
  describe('#delete', function () {
    it('remove values from a list', function () {
      let store = createStore().push('endpoints', 1, 2, 3, 3, 4, 5, 6)

      expect(
        store.delete(['endpoints'], 4).get('endpoints')
      ).to.be.eql([1, 2, 3, 3, 5, 6])

      expect(
        store.delete(['endpoints'], 1, 2, 3).get('endpoints')
      ).to.be.eql([3, 4, 5, 6])

      expect(
        store.delete(['endpoints'], 1, 2, 3)
             .delete('endpoints', 6, 5)
             .get('endpoints')
      ).to.be.eql([3, 4])

      expect(
        store.delete(['endpoints'], 1, 2, 3, 3, 4, 5, 6)
             .has('endpoints')
      ).to.be.false

      expect(store.delete('endpoints').has('endpoints')).to.be.false
    })

    it('remove the value of an endpoint', function () {
      let store = createStore().set('endpoints', 'lolcat')

      expect(
        store.delete(['endpoints'], 8, 3, 4).get('endpoints')
      ).to.be.equal('lolcat')

      expect(
        store.delete(['endpoints'], 3, 2, 'lolcat').get('endpoints')
      ).to.be.null

      expect(
        store.delete('endpoints', 'lolcat').get('endpoints')
      ).to.be.null

      expect(
        store.delete('endpoints', 5).get('endpoints')
      ).to.be.equal('lolcat')

      expect(
        store.delete('endpoints').get('endpoints')
      ).to.be.null
    })

    it(
      'do nothing when we delete the value of an unused endpoint',
      function () {
        let store = createStore().delete('endpoints.first.second')
                                 .delete('node')

        for (let endpoint of [
          'endpoints', 'endpoints.first', 'endpoints.second', 'node'
        ]) {
          expect(store.has(endpoint)).to.be.false
          expect(store.get(endpoint)).to.be.equal(null)
        }
      }
    )
  })// #delete
}
