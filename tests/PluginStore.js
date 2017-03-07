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
  }) // #set

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
  }) // #push

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
             .has('endpoints')
      ).to.be.false

      expect(store.delete('endpoints').has('endpoints')).to.be.false
    })

    it('remove the value of an endpoint', function () {
      let store = (new PluginStore()).set('endpoints', 'lolcat')

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

    it('do nothing when we delete the value of an unused endpoint', function () {
      let store = (new PluginStore()).delete('endpoints.first.second')
                                     .delete('node')

      for (let endpoint of [
        'endpoints', 'endpoints.first', 'endpoints.second', 'node'
      ]) {
        expect(store.has(endpoint)).to.be.false
        expect(store.get(endpoint)).to.be.equal(null)
      }
    })
  })// #delete

  describe('#get', function () {
    let store = (new PluginStore()).set('endpoints.first', 'azerty')
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

      expect(value).to.be.eql({'some' : 2})
      value.other = 'other'
      expect(value).to.be.eql({'some' : 2, 'other': 'other'})
      expect(store.get('endpoints.second')).to.be.eql({'some': 2})
    })

    it('return null for invalid endpoints', function () {
      expect(store.get('wazegaga')).to.be.null
    })
  }) // #get

  describe('#has', function () {
    let store = (new PluginStore()).set('endpoints.first', 'azerty')
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
  }) // #has

  describe('#filter', function () {
    let store = (new PluginStore()).set('endpoints.first', 'azerty')
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

  describe('#endpoints', function () {
    it('return a list of used endpoints', function () {
      let store = new PluginStore().set('endpoints.first', 'azerty')
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
      let store = new PluginStore().set('endpoints.first', 'azerty')
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
      let store = new PluginStore()

      expect(store.endpoints()).to.be.eql([])
    })
  }) // #endpoints

  describe('#clear', function () {
    it('clear the store of its data', function () {
      let store = new PluginStore().set('endpoints.first', 'azerty')
                                   .set('endpoints.second', 5)
                                   .set('endpoints.third.first', 6)

      expect(store.endpoints().length).to.be.equal(3)
      expect(store.clear().endpoints().length).to.be.equal(0)
    })

    it('is immutable', function () {
      let store = new PluginStore().set('endpoints.first', 'azerty')
                                   .set('endpoints.second', 5)
                                   .set('endpoints.third.first', 6)

      expect(store.endpoints().length).to.be.equal(3)

      let updatedStore = store.clear()

      expect(updatedStore.endpoints().length).to.be.equal(0)
      expect(store.endpoints().length).to.be.equal(3)
    })
  }) // #endpoints
})
