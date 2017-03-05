/* eslint-env mocha */

import React, { Component } from 'react'
import { Kernel } from '../src/index'
import { mount } from 'enzyme'
import { expect } from 'chai'

class EmptyComponent extends Component {
  render () { return null }
}

class KernelChildren extends Component {
  render () {
    return (
      <div>
        {(this.context.kernel) ? 'true' : 'false'}
      </div>
    )
  }
}

KernelChildren.contextTypes = {
  'kernel': Kernel.type.isRequired
}

describe('<Kernel />', function () {
  it('must be mountable', function () {
    mount(<Kernel />)
  })

  for (let [type, value] of Object.entries({
    'components': <EmptyComponent />,
    'components class': EmptyComponent,
    'callback': (props, children) => (<EmptyComponent />)
  })) {
    it(
      `allow to plugin ${type} to a specific endpoint`,
      function () {
        let kernel = mount(<Kernel />)
        kernel.instance().plugin('endpoints.test', value)
        let plugged = kernel.instance().getPlugged('endpoints.test')

        expect(plugged.indexOf(value)).to.be.at.least(0)
      }
    )

    it(
      `allow to plugout ${type} of a specific endpoint`,
      function () {
        let kernel = mount(<Kernel />)
        kernel.instance().plugin('endpoints.test', value)
        kernel.instance().plugout('endpoints.test', value)
        let plugged = kernel.instance().getPlugged('endpoints.test')

        expect(plugged.indexOf(value)).to.equal(-1)
      }
    )
  }

  it('allow to get used endpoints', function () {
    let kernel = mount(<Kernel />)
    let paths = ['endpoints.a', 'endpoints.b', 'endpoints.c']

    for (let path of paths) {
      kernel.instance().plugin(path, <EmptyComponent />)
      kernel.instance().plugin(path, <EmptyComponent />)
    }

    let endpoints = kernel.instance().getPaths()

    for (let path of paths) {
      expect(endpoints.indexOf(path)).to.be.at.least(0)
      let count = endpoints.reduce((base, x) => base + (x === path) ? 1 : 0)
      expect(count).to.equal(1)
    }
  })

  it('allow to check if an endpoint is used', function () {
    let kernel = mount(<Kernel />)
    let paths = ['endpoints.a', 'endpoints.b', 'endpoints.c']

    for (let path of paths) {
      kernel.instance().plugin(path, <EmptyComponent />)
      kernel.instance().plugin(path, <EmptyComponent />)
    }

    for (let path of paths) {
      expect(kernel.instance().hasPath(path)).to.be.true
    }

    expect(kernel.instance().hasPath('azarby')).to.be.false
  })

  it('can wrap another component', function () {
    let kernel = mount(<Kernel />)
    let kernelWithChildren = mount(<Kernel><div>Content</div></Kernel>)

    expect(kernel.find('div').exists()).to.be.false
    expect(kernelWithChildren.find('div').exists()).to.be.true
  })

  it('must install a kernel context', function () {
    let kernel = mount(<Kernel><KernelChildren /></Kernel>)

    expect(kernel.find(KernelChildren).text()).to.equal('true')
  })
})
