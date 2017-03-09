/* eslint-env mocha */

import { PluginStore } from 'library'
import { isPluginStoreType } from './src/PluginStoreType/spec'

describe('PluginStore', function () {
  isPluginStoreType(() => new PluginStore())
})
