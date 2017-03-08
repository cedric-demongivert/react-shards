/* eslint-env mocha */

import { PluginStore } from 'library'
import { StandardPluginStore } from './src/StandardPluginStore.spec'

StandardPluginStore('PluginStore', () => new PluginStore())
