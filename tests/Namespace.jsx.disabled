/* eslint-env mocha */

import React, { Component } from 'react'
import { Kernel, Namespace } from '../src/index'
import { mount, shallow } from 'enzyme'
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

describe('<Namespace />', function () {
  it('must be mountable', function () {
    mount(<Namespace name='unnamed' />)
  })

  it('can wrap another component', function () {
    let component = mount(<Namespace name='unnamed' />)
    let componentWithChildren = mount(
      <Namespace name='unnamed'>
        <div>Content</div>
      </Namespace>
    )

    expect(component.find('div').exists()).to.be.false
    expect(componentWithChildren.find('div').exists()).to.be.true
  })

  for (let [type, value] of Object.entries({
    'components': <EmptyComponent />,
    'components class': EmptyComponent,
    'callback': (props, children) => (<EmptyComponent />)
  })) {
    it(
      `allow to plugin ${type} to a scoped endpoint`,
      function () {
        let kernel = shallow(<Kernel />)
        let namespace = shallow(
          <Namespace name='endpoints' />, {
            'context': {
              'kernel': kernel.instance()
            }
          }
        )

        namespace.instance().plugin('test', value)
        let plugged = namespace.instance().getPlugged('test')

        expect(plugged.indexOf(value)).to.be.at.least(0)
        expect(kernel.instance().hasPath('endpoints.test')).to.be.true
      }
    )

    it(
      `allow to plugout ${type} of a specific endpoint`,
      function () {
        let kernel = shallow(<Kernel />)
        let namespace = shallow(
          <Namespace name='endpoints' />, {
            'context': {
              'kernel': kernel.instance()
            }
          }
        )

        namespace.instance().plugin('test', value)
        namespace.instance().plugout('test', value)
        let plugged = namespace.instance().getPlugged('test')

        expect(plugged.indexOf(value)).to.equal(-1)
      }
    )
  }

  it('allow to get used endpoints', function () {
    let kernel = shallow(<Kernel />)
    let namespace = shallow(
      <Namespace name='endpoints' />, {
        'context': {
          'kernel': kernel.instance()
        }
      }
    )
    let paths = ['a', 'b', 'c']

    for (let path of paths) {
      namespace.instance().plugin(path, <EmptyComponent />)
      namespace.instance().plugin(path, <EmptyComponent />)
    }

    let endpoints = namespace.instance().getPaths()
    let fullEndpoints = kernel.instance().getPaths()

    for (let path of paths) {
      expect(endpoints.indexOf(path)).to.be.at.least(0)
      let count = endpoints.reduce((base, x) => base + (x === path) ? 1 : 0)
      expect(count).to.equal(1)

      expect(fullEndpoints.indexOf('endpoints.' + path)).to.be.at.least(0)
      count = fullEndpoints.reduce(
        (base, x) => base + (x === 'endpoints.' + path) ? 1 : 0
      )
      expect(count).to.equal(1)
    }
  })

  it('allow to check if an endpoint is used', function () {
    let kernel = shallow(<Kernel />)
    let namespace = shallow(
      <Namespace name='endpoints' />, {
        'context': {
          'kernel': kernel.instance()
        }
      }
    )
    let paths = ['endpoints.a', 'endpoints.b', 'endpoints.c']

    for (let path of paths) {
      namespace.instance().plugin(path, <EmptyComponent />)
      namespace.instance().plugin(path, <EmptyComponent />)
    }

    for (let path of paths) {
      expect(namespace.instance().hasPath(path)).to.be.true
      expect(kernel.instance().hasPath('endpoints.' + path)).to.be.true
    }

    expect(namespace.instance().hasPath('azarby')).to.be.false
    expect(kernel.instance().hasPath('endpoints.azarby')).to.be.false
  })

  it('must install a kernel context', function () {
    let kernel = mount(
      <Kernel>
        <Namespace name='endpoints'>
          <KernelChildren />
        </Namespace>
      </Kernel>
    )

    expect(kernel.find(KernelChildren).text()).to.equal('true')
  })

  it('can be bypassed', function () {
    let kernel = shallow(<Kernel />)
    let namespace = shallow(
      <Namespace name='endpoints' />, {
        'context': {
          'kernel': kernel.instance()
        }
      }
    )
    let value = <EmptyComponent />

    namespace.instance().plugin('unscoped.value', value, false)
    expect(kernel.instance().hasPath('unscoped.value')).to.be.true

    let plugged = namespace.instance().getPlugged('unscoped.value')
    expect(plugged.indexOf(value)).to.equal(-1)

    plugged = namespace.instance().getPlugged('unscoped.value', false)
    expect(plugged.indexOf(value)).to.be.at.least(0)

    expect(namespace.instance().hasPath('unscoped.value')).to.be.false
    expect(namespace.instance().hasPath('unscoped.value', false)).to.be.true

    expect(namespace.instance().getPaths()).to.have.lengthOf(0)
    expect(namespace.instance().getPaths(false)).to.have.lengthOf(1)
    expect(namespace.instance().getPaths(false)).to.include.members(
      ['unscoped.value']
    )

    namespace.instance().plugout('unscoped.value', value, false)
    plugged = namespace.instance().getPlugged('unscoped.value', false)
    expect(plugged.indexOf(value)).to.equal(-1)
  })
})
