/* eslint-env mocha */

import React from 'react'
import { Plugins, PluginStore } from '../src/index'
import { isPluginStore } from './src/PluginStore/spec'
import { mount } from 'enzyme'
// import { expect } from 'chai'

describe('<Plugins />', function () {
  it('is mountable', function () {
    mount(<Plugins />)
  })

  isPluginStore(() => {
    let element = mount(
      <Plugins store={new PluginStore.MutableStore()} />
    )

    return element.instance()
  })
})
