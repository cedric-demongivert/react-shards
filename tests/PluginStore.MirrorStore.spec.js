/* eslint-env mocha */

import { PluginStore } from 'library'
import { isPluginStore } from './src/PluginStore/spec'

import { expect, spy } from 'chai'

describe('PluginStore.MirrorStore', function () {
  let mirroredCalls = {
    'set': ['endpoints.first', [1, 2, 3, 4]],
    'push': ['endpoints.second', 1, 2, 3, 4],
    'clear': ['endpoints.first'],
    'delete': ['endpoints.second', 1, 4],
    'filter': ['endpoints.second', (x) => x < 3]
  }

  describe('of a PluginStore.ImmutableStore', function () {
    isPluginStore(
      () => {
        return new PluginStore.MirrorStore({
          parent: new PluginStore.ImmutableStore(),
          reflected: new PluginStore.MutableStore()
        })
      }
    )

    for (let mirroredMethod in mirroredCalls) {
      it('mirror calls of #' + mirroredMethod, function () {
        let reflected = new PluginStore.MutableStore()
        let parent = new PluginStore.ImmutableStore()
        let mirror = new PluginStore.MirrorStore({parent, reflected})

        for (let methodToSpy in mirroredCalls) {
          reflected[methodToSpy] = spy(reflected[methodToSpy])
        }

        let params = mirroredCalls[mirroredMethod]
        mirror[mirroredMethod](...params)

        expect(reflected[mirroredMethod]).to.have.been.called.once
        expect(reflected[mirroredMethod]).to.have.been.called.with(...params)
      })
    }
  })

  describe('of a PluginStore.MutableStore', function () {
    isPluginStore(
      () => {
        return new PluginStore.MirrorStore({
          parent: new PluginStore.MutableStore(),
          reflected: new PluginStore.MutableStore()
        })
      }
    )

    for (let mirroredMethod in mirroredCalls) {
      it('mirror calls of #' + mirroredMethod, function () {
        let reflected = new PluginStore.MutableStore()
        let parent = new PluginStore.ImmutableStore()
        let mirror = new PluginStore.MirrorStore({parent, reflected})

        for (let methodToSpy in mirroredCalls) {
          reflected[methodToSpy] = spy(reflected[methodToSpy])
        }

        let params = mirroredCalls[mirroredMethod]
        mirror[mirroredMethod](...params)

        expect(reflected[mirroredMethod]).to.have.been.called.once
        expect(reflected[mirroredMethod]).to.have.been.called.with(...params)
      })
    }
  })
})
