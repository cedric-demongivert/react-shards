/* eslint-env mocha */

import React, { Component } from 'react'
import { PluginStore, Endpoint } from '../src/index'
import { isPluginStore } from './src/PluginStore/spec'
import { isSubStore } from './src/SubStore/spec'
import { mount } from 'enzyme'

describe('@Endpoint', function () {
  @Endpoint
  class PureEndpoint extends Component {
    render () { return this.props.children || null }
  }

  it('is mountable', function () {
    mount(<PureEndpoint name='endpoints.substore' />, {
      'context': {
        'pluginStore': new PluginStore.ImmutableStore()
      }
    })
  })

  describe('of a PluginStore.MutableStore', function () {
    isPluginStore(() => {
      let element = mount(<PureEndpoint name='endpoints.substore' />, {
        'context': {
          'pluginStore': new PluginStore.MutableStore()
        }
      })

      return element.instance()
    })

    isSubStore(() => {
      return new PluginStore.MutableStore()
    }, (parentStore, endpoint) => {
      let element = mount(<PureEndpoint name={endpoint} />, {
        'context': {
          'pluginStore': parentStore
        }
      })

      return element.instance()
    })
  })

  describe('of a PluginStore.ImmutableStore', function () {
    isPluginStore(() => {
      let element = mount(<PureEndpoint name='endpoints.substore' />, {
        'context': {
          'pluginStore': new PluginStore.ImmutableStore()
        }
      })

      return element.instance()
    })

    isSubStore(() => {
      return new PluginStore.ImmutableStore()
    }, (parentStore, endpoint) => {
      let element = mount(<PureEndpoint name={endpoint} />, {
        'context': {
          'pluginStore': parentStore
        }
      })

      return element.instance()
    })
  })
})
