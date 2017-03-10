/* eslint-env mocha */

import { PluginStore } from 'library'
import { isPluginStore } from './src/PluginStore/spec'

describe('PluginStore.MutableStore', function () {
  isPluginStore(() => new PluginStore.MutableStore())
})
