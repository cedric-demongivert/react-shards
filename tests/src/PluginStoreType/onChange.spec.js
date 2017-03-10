/* eslint-env mocha */

import { expect, spy } from 'chai'

export function isPluginStoreTypeOnChange (createStore) {
  it('throw an error if it is call on an immutable store', function () {
    let store = createStore()

    if (store.isImmutable()) {
      expect(() => {
        store.onChange(null, () => null)
      }).to.throw()
    }
  })

  it('allow to listen for change in a mutable store (set)', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('endpoints.first')
      }
      listener = spy(listener)

      store.onChange(null, listener)
      store.set('endpoints.first', 'coconut')

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['endpoints', 'first'], store)
      expect(listenerResult).to.be.equal('coconut')
    }
  })

  it('allow to listen for change in a mutable store (delete)', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('endpoints.first')
      }
      listener = spy(listener)

      store.set('endpoints.first', [1, 2, 2, 3, 4])
      store.onChange(null, listener)
      store.delete('endpoints.first', 2, 4)

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['endpoints', 'first'], store)
      expect(listenerResult).to.be.eql([1, 2, 3])
    }
  })

  it('allow to listen for change in a mutable store (clear)', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.has('endpoints.first')
      }
      listener = spy(listener)

      store.set('endpoints.first', [1, 2, 2, 3, 4])
      store.onChange(null, listener)
      store.clear('endpoints.first')

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['endpoints', 'first'], store)
      expect(listenerResult).to.be.false
    }
  })

  it('allow to listen for change in a mutable store (filter)', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('endpoints.first')
      }
      listener = spy(listener)

      store.set('endpoints.first', [1, 2, 2, 3, 4])
      store.onChange(null, listener)
      store.filter('endpoints.first', (x) => x <= 2)

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['endpoints', 'first'], store)
      expect(listenerResult).to.be.eql([1, 2, 2])
    }
  })

  it('allow to listen for change in a mutable store (push)', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('endpoints.first')
      }
      listener = spy(listener)

      store.set('endpoints.first', [1, 2])
      store.onChange(null, listener)
      store.push('endpoints.first', 1)

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['endpoints', 'first'], store)
      expect(listenerResult).to.be.eql([1, 2, 1])

      store.push('endpoints.first', 3, 4, 4)

      expect(listener).to.have.been.called.twice
      expect(listener).to.have.been.called.with(['endpoints', 'first'], store)
      expect(listenerResult).to.be.eql([1, 2, 1, 3, 4, 4])
    }
  })

  it('allow to listen for change of a sub-store', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('first')
      }
      listener = spy(listener)

      store.set('endpoints.pack.first', [1, 2])
      store.onChange('endpoints.pack', listener)
      store.push('endpoints.pack.first', 1)
      store.push('endpoints', 1, 2)

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['first'])
      expect(listenerResult).to.be.eql([1, 2, 1])
    }
  })

  it('return a unsubscribe callback', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('endpoints.first')
      }
      listener = spy(listener)

      store.set('endpoints.first', [1, 2])
      let unsubscribe = store.onChange(null, listener)
      store.push('endpoints.first', 1)
      unsubscribe()
      store.push('endpoints.first', 1, 2)

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['endpoints', 'first'])
      expect(listenerResult).to.be.eql([1, 2, 1])
    }
  })

  it('return a unsubscribe callback for substore', function () {
    let store = createStore()

    if (!store.isImmutable()) {
      let listenerResult = null
      let listener = (store, endpoint) => {
        listenerResult = store.get('first')
      }
      listener = spy(listener)

      store.set('endpoints.pack.first', [1, 2])
      let unsubscribe = store.onChange('endpoints.pack', listener)
      store.push('endpoints.pack.first', 1)
      unsubscribe()
      store.push('endpoints.pack.first', 1, 2)

      expect(listener).to.have.been.called.once
      expect(listener).to.have.been.called.with(['first'])
      expect(listenerResult).to.be.eql([1, 2, 1])
    }
  })
}
