/* eslint-env mocha */

import { expect } from 'chai'

export function StandardPluginStore_push (createStore) {
  describe('#push', function () {
    it(
      ['allow to set a list of values into an empty',
       'endpoint and to retrieve them'].join(' '),
      function () {
        let store = createStore().push('endpoints', 'azerty')
                                 .push('endpoints.first', 2)
                                 .push('endpoints.second', [1, 2, 3])
                                 .push(['endpoints', 'third'], 1, 2, 3)

        expect(store.get(['endpoints'])).to.be.eql(['azerty'])
        expect(store.get('endpoints.first')).to.be.eql([2])
        expect(store.get('endpoints.second')).to.be.eql([[1, 2, 3]])
        expect(store.get(['endpoints', 'third'])).to.be.eql([1, 2, 3])
      }
    )

    it('push values continuously into an endpoint', function () {
      let store = createStore().push('first', 'azerty')
                               .push('first', 2)
                               .push(['first'], 1, 2, 3)

      expect(store.get(['first'])).to.be.eql(['azerty', 2, 1, 2, 3])
    })

    it('change a previously setted value into a list of values', function () {
      let store = createStore().set('first', 'azerty')
                               .push(['first'], 2, 'a', {'test' : 2})

      expect(store.get(['first'])).to.be.eql(['azerty', 2, 'a', {'test' : 2}])
    })

    it('is immutable', function () {
      let firstStore = createStore()
      let secondStore = firstStore.push('endpoints.first', 1, 2)
      let thirdStore = secondStore.push('endpoints.first', 3, 4, 5)
      let lastStore = secondStore.push('endpoints.second', 3, 4, 5)

      expect(firstStore.get('endpoints.first')).to.be.null
      expect(firstStore.get('endpoints.second')).to.be.null
      expect(secondStore.get('endpoints.first')).to.be.eql([1, 2])
      expect(secondStore.get('endpoints.second')).to.be.null
      expect(thirdStore.get('endpoints.first')).to.be.eql([1, 2, 3, 4, 5])
      expect(thirdStore.get('endpoints.second')).to.be.null
      expect(lastStore.get('endpoints.first')).to.be.eql([1, 2])
      expect(lastStore.get('endpoints.second')).to.be.eql([3, 4, 5])
      expect(thirdStore).to.not.equal(secondStore)
      expect(secondStore).to.not.equal(firstStore)
      expect(firstStore).to.not.equal(lastStore)
    })
  }) // #push
}
