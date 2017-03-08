/* eslint-env mocha */

import { expect } from 'chai'

export function StandardPluginStore_filter (createStore) {
  describe('#filter', function () {
    let store = createStore().set('endpoints.first', 'azerty')
                             .set('endpoints.third', [1, 2, 3, 6, 7])

    it('keep only valid values in a list', function () {
      expect(
        store.filter('endpoints.third', (x) => x <= 3)
             .get('endpoints.third')
      ).to.be.eql([1, 2, 3])
    })

    it('remove an endpoint value if it match the filter', function () {
      expect(
        store.filter('endpoints.first', (x) => x == 'lol')
             .get('endpoints.first')
      ).to.be.equal('azerty')

      let updatedStore = store.filter('endpoints.first', (x) => x == 'azerty')
      expect(updatedStore.get('endpoints.first')).to.be.null
      expect(updatedStore.has('endpoints.first')).to.be.false
    })

    it(
      'remove an endpoint when the filter remove all of its values',
      function () {
        let updatedStore = store.filter('endpoints.third', (x) => false)

        expect(updatedStore.has('endpoints.third')).to.be.false
        expect(updatedStore.get('endpoints.third')).to.be.null
      }
    )
  }) // #filter
}
