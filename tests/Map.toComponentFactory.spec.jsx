/* eslint-env mocha */

import { Map } from 'library'

import React, { Component } from 'react'
import { expect } from 'chai'

class SomeComponent extends Component {
  render () { return this.props.children || null }
}

describe('Map.toComponentFactory', function () {
  it('transform component class into a component factory', function () {
    let factory = Map.toComponentFactory(SomeComponent)
    let children = (<h1>Children</h1>)
    let element = factory({'someProps': 'value'}, children)

    expect(element.props).to.be.eql({
      'someProps': 'value',
      'children': children
    })

    expect(element.type).to.be.equal(SomeComponent)
  })

  it('transform component into a component factory', function () {
    let factory = Map.toComponentFactory(<SomeComponent myProp='prop' />)
    let children = (<h1>Children</h1>)
    let element = factory({'someProps': 'value'}, children)

    expect(element.props).to.be.eql({
      'someProps': 'value',
      'myProp': 'prop',
      'children': children
    })

    expect(element.type).to.be.equal(SomeComponent)
  })

  it('preserve component factory', function () {
    let rawFactory = (props, children) => {
      return (
        <SomeComponent myProp='prop' {...props}>{children}</SomeComponent>
      )
    }
    let factory = Map.toComponentFactory(rawFactory)
    let children = (<h1>Children</h1>)
    let element = factory({'someProps': 'value'}, children)

    expect(rawFactory).to.be.equal(factory)

    expect(element.props).to.be.eql({
      'someProps': 'value',
      'myProp': 'prop',
      'children': children
    })

    expect(element.type).to.be.equal(SomeComponent)
  })
})
