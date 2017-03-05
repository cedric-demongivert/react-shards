/* eslint-env mocha */

import React, { Component } from 'react'
import { Compose, Kernel } from '../src/index'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { assign } from 'lodash'

function Expose (...services) {
  return (BaseClass) => {
    let result = class extends BaseClass {
      getChildContext () {
        let base = {}

        if (super.getChildContext) {
          base = super.getChildContext()
        }

        for (let service of services) {
          base[service] = this
        }

        return base
      }
    }

    result.childContextTypes = assign({}, BaseClass.childContextTypes)

    for (let service of services) {
      result.childContextTypes[service] = React.PropTypes.object.isRequired
    }

    return result
  }
}

function Require (...services) {
  return (BaseClass) => {
    let result = class extends BaseClass { }

    result.contextTypes = assign({}, BaseClass.contextTypes)

    for (let service of services) {
      result.contextTypes[service] = React.PropTypes.object.isRequired
    }

    return result
  }
}

class ProxyComponent extends Component {
  render () {
    return this.props.children
  }
}

describe('<Compose />', function () {
  it(
    'compose plugged components by using their context properties',
    function () {
      @Expose('FirstService')
      class FirstComponent extends ProxyComponent {
        render () {
          return (<div className='first-component'>{this.props.children}</div>)
        }
      }

      @Require('FirstService')
      @Expose('SecondService')
      class SecondComponent extends ProxyComponent {
        render () {
          return (<div className='second-component'>{this.props.children}</div>)
        }
      }

      @Require('SecondService')
      class ThirdComponent extends ProxyComponent {
        render () {
          return (<div className='third-component'>{this.props.children}</div>)
        }
      }

      let kernel = shallow(<Kernel />)

      kernel.instance().plugin(
        'services',
        (props, children) => (
          <SecondComponent {...props}>{ children }</SecondComponent>
        )
      )
      kernel.instance().plugin('services', <FirstComponent />)
      kernel.instance().plugin('services', ThirdComponent)

      let compose = shallow(<Compose name='services' />, {
        'context': {
          'kernel': kernel.instance()
        }
      })

      for (let result of [FirstComponent, SecondComponent, ThirdComponent]) {
        expect(compose.find(result)).to.have.length(1)
        compose = compose.find(result).first().dive()
      }
    }
  )

  it(
    'must throw an error if components have circular dependencies',
    function () {
      @Expose('FirstService')
      @Require('ThirdService')
      class FirstComponent extends ProxyComponent {
        render () {
          return (<div className='first-component'>{this.props.children}</div>)
        }
      }

      @Expose('SecondService')
      @Require('FirstService')
      class SecondComponent extends ProxyComponent {
        render () {
          return (<div className='second-component'>{this.props.children}</div>)
        }
      }

      @Expose('ThirdService')
      @Require('SecondService')
      class ThirdComponent extends ProxyComponent {
        render () {
          return (<div className='third-component'>{this.props.children}</div>)
        }
      }

      let kernel = shallow(<Kernel />)

      kernel.instance().plugin(
        'services',
        (props, children) => (
          <SecondComponent {...props}>{ children }</SecondComponent>
        )
      )
      kernel.instance().plugin('services', <FirstComponent />)
      kernel.instance().plugin('services', ThirdComponent)
      expect(shallow.bind(this, <Compose name='services' />, {
        'context': {
          'kernel': kernel.instance()
        }
      })).to.throw()
    }
  )
})
