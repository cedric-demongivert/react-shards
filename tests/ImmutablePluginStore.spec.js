/* eslint-env mocha */

import { ImmutablePluginStore } from 'library'
import { isPluginStoreType } from './src/PluginStoreType/spec'

describe('ImmutablePluginStore', function () {
  isPluginStoreType(() => new ImmutablePluginStore())
})
