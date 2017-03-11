/* eslint-env mocha */

import { PluginStore } from 'library'
import { isPluginStore } from './src/PluginStore/spec'
import { isSubStore } from './src/SubStore/spec'

describe('PluginStore.SubStore', function () {
  describe('of a PluginStore.ImmutableStore', function () {
    isPluginStore(
      () => {
        return new PluginStore.SubStore(
          new PluginStore.ImmutableStore(),
          'endpoints.substore'
        )
      }
    )

    isSubStore(
      () => new PluginStore.ImmutableStore(),
      (parentStore, path) => new PluginStore.SubStore(
        parentStore, path
      )
    )
  })

  describe('of a PluginStore.MutableStore', function () {
    isPluginStore(
      () => {
        return new PluginStore.SubStore(
          new PluginStore.MutableStore(),
          'endpoints.substore'
        )
      }
    )

    isSubStore(
      () => new PluginStore.MutableStore(),
      (parentStore, path) => new PluginStore.SubStore(
        parentStore, path
      )
    )
  })
})
