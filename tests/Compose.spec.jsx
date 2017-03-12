/* eslint-env mocha */

import React from 'react'
import { PluginStore, Compose } from '../src/index'
import { mount } from 'enzyme'
import { expect } from 'chai'

describe('<Compose />', function () {
  it('must be mountable', function () {
    mount(<Compose name='components.elements' />, {
      'context': {
        'pluginStore': new PluginStore.MutableStore()
      }
    })
  })

  it('compose its elements', function () {
    let store = new PluginStore.MutableStore()
    store.push(
      'components',
      (<div className='first-injected' />),
      (<div className='second-injected' />),
      (<div className='third-injected' />)
    )

    let composition = mount(<Compose name='components' />, {
      'context': {
        'pluginStore': store
      }
    })

    expect(composition.find(
      '.first-injected .second-injected .third-injected'
    )).to.have.length(1)
  })
})
