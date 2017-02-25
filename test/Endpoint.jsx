/* eslint-env mocha */

import React, { Component } from 'react'
import { Endpoint, Kernel } from '../src/index'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'

class EmptyComponent extends Component {
  render () { return null }
}

describe('@Endpoint', function () {
  @Endpoint
  class EndpointComponent extends Component {
    render () { return null }
  }

  for (let methodName of [
    'getPlugged',
    'hasPluggedContent',
    'toComponent',
    'getComponentType'
  ]) {
    it(`must define a ${methodName} method when used`, function () {
      let instance = shallow(<EndpointComponent name='lolcat' />).instance()
      expect(instance[methodName]).to.be.a('function')
    })
  }

  it('must allow to get plugged components of a specific path', function () {
    let kernel = shallow(<Kernel />)
    let endpoint = shallow(
      <EndpointComponent name='endpoints.a' />, {
        'context': {
          'kernel': kernel.instance()
        }
      }
    )
    let value = (<EmptyComponent />)

    kernel.instance().plugin('endpoints.a', value)
    let plugged = endpoint.instance().getPlugged()

    expect(plugged.indexOf(value)).to.be.at.least(0)
  })

  it('must allow to check if components are plugged', function () {
    let kernel = shallow(<Kernel />)
    let endpoint = shallow(
      <EndpointComponent name='endpoints.a' />, {
        'context': {
          'kernel': kernel.instance()
        }
      }
    )

    expect(endpoint.instance().hasPluggedContent()).to.be.false

    kernel.instance().plugin('endpoints.a', (<EmptyComponent />))

    expect(endpoint.instance().hasPluggedContent()).to.be.true
  })

  for (let [type, value] of Object.entries({
    'components': <EmptyComponent />,
    'components class': EmptyComponent,
    'callback': (props, children) => (<EmptyComponent />)
  })) {
    it(
      `allow to get the type of plugged ${type}`,
      function () {
        let kernel = shallow(<Kernel />)
        let endpoint = shallow(
          <EndpointComponent name='endpoints.a' />, {
            'context': {
              'kernel': kernel.instance()
            }
          }
        )

        kernel.instance().plugin('endpoints.a', value)
        let plugged = endpoint.instance().getPlugged()
        let componentType = endpoint.instance().getComponentType(plugged[0])

        expect(componentType).to.equal(EmptyComponent)
      }
    )

    it(
      `allow to create or get plugged ${type}`,
      function () {
        let kernel = shallow(<Kernel />)
        let endpoint = shallow(
          <EndpointComponent name='endpoints.a' />, {
            'context': {
              'kernel': kernel.instance()
            }
          }
        )

        kernel.instance().plugin('endpoints.a', value)

        let plugged = endpoint.instance().getPlugged()
        let component = endpoint.instance().toComponent(plugged[0])

        expect(mount(component).type()).to.equal(EmptyComponent)
      }
    )
  }
})
