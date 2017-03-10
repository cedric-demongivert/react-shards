/* eslint-env mocha */

import { PluginStore } from 'library'
import { isPluginStore } from './src/PluginStore/spec'

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
  })
})
