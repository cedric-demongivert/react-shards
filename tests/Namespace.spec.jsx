/* eslint-env mocha */

import React from 'react'
import { PluginStore, Namespace } from '../src/index'
import { isPluginStore } from './src/PluginStore/spec'
import { isSubStore } from './src/SubStore/spec'
import { mount } from 'enzyme'

describe('<Namespace />', function () {
  it('is mountable', function () {
    mount(<Namespace name='endpoints.substore' />, {
      'context': {
        'pluginStore': new PluginStore.ImmutableStore()
      }
    })
  })

  describe('of a PluginStore.MutableStore', function () {
    isPluginStore(() => {
      let element = mount(<Namespace name='endpoints.substore' />, {
        'context': {
          'pluginStore': new PluginStore.MutableStore()
        }
      })

      return element.instance()
    })

    isSubStore(() => {
      return new PluginStore.MutableStore()
    }, (parentStore, endpoint) => {
      let element = mount(<Namespace name={endpoint} />, {
        'context': {
          'pluginStore': parentStore
        }
      })

      return element.instance()
    })
  })

  describe('of a PluginStore.ImmutableStore', function () {
    isPluginStore(() => {
      let element = mount(<Namespace name='endpoints.substore' />, {
        'context': {
          'pluginStore': new PluginStore.ImmutableStore()
        }
      })

      return element.instance()
    })

    isSubStore(() => {
      return new PluginStore.ImmutableStore()
    }, (parentStore, endpoint) => {
      let element = mount(<Namespace name={endpoint} />, {
        'context': {
          'pluginStore': parentStore
        }
      })

      return element.instance()
    })
  })
})
