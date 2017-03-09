/* eslint-env mocha */

import { SubPluginStore, ImmutablePluginStore, PluginStore } from 'library'
import { isPluginStoreType } from './src/PluginStoreType/spec'

describe('SubPluginStore', function () {
  describe('of an ImmutablePluginStore', function () {
    isPluginStoreType(
      () => {
        return new SubPluginStore(
          new ImmutablePluginStore(), 'endpoints.substore'
        )
      }
    )
  })

  describe('of a PluginStore', function () {
    isPluginStoreType(
      () => {
        return new SubPluginStore(
          new PluginStore(), 'endpoints.substore'
        )
      }
    )
  })
})
