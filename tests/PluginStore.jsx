/* eslint-env mocha */

import { PluginStore } from 'library'
import { expect } from 'chai'

describe('PluginStore', function () {
  it('must be instanciable', function () {
    let store = new PluginStore()
    expect(store).to.not.be.null
  })

  describe('#set', function () {
    it('allow to set a value for an endpoint and to retrieve it', function () {
      let store = (new PluginStore()).set('endpoints', 'azerty')
                                     .set('endpoints.first', 2)
                                     .set(['endpoints', 'second'], [1, 2, 3])

      expect(store.get('endpoints.first')).to.be.equal(2)
      expect(store.get(['endpoints', 'second'])).to.be.eql([1, 2, 3])
      expect(store.get(['endpoints'])).to.be.equal('azerty')
    })

    it('must replace an existing value with another', function () {
      let store = (new PluginStore()).set('test', 'lolcat')

      expect(store.get('test')).to.be.equal('lolcat')

      let updatedStore = store.set('test', 'loldog')

      expect(updatedStore.get('test')).to.be.equal('loldog')
    })

    it('is immutable', function () {
      let firstStore = new PluginStore()
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
    })

    it(
      ['must remove unused endpoints when an endpoint',
       'is set to a null-like value'].join(' '),
      function () {
        let store = (new PluginStore()).set('endpoints.parent.child', 'lolcat')
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
  })

  describe('#push', function () {
    it(
      ['allow to set a list of values into an empty',
       'endpoint and to retrieve them'].join(' '),
      function () {
        let store = (new PluginStore()).push('endpoints', 'azerty')
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
      let store = (new PluginStore()).push('first', 'azerty')
                                     .push('first', 2)
                                     .push(['first'], 1, 2, 3)

      expect(store.get(['first'])).to.be.eql(['azerty', 2, 1, 2, 3])
    })

    it('change a previously setted value into a list of values', function () {
      let store = (new PluginStore()).set('first', 'azerty')
                                     .push(['first'], 2, 'a', {'test' : 2})

      expect(store.get(['first'])).to.be.eql(['azerty', 2, 'a', {'test' : 2}])
    })

    it('is immutable', function () {
      let firstStore = new PluginStore()
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
  })

  describe('#delete', function () {
    it('remove values from a list', function () {
      let store = (new PluginStore()).push('endpoints', 1, 2, 3, 3, 4, 5, 6)

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
             .get('endpoints')
      ).to.be.false

      expect(store.delete('endpoints').has('endpoints')).to.be.false
    })
  })
})
