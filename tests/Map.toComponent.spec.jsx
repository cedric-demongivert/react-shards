/* eslint-env mocha */

import { Map } from 'library'

import React, { Component } from 'react'
import { expect } from 'chai'

class SomeComponent extends Component {
  render () { return this.props.children || null }
}

describe('Map.toComponent', function () {
  it('transform component class into component', function () {
    let element = Map.toComponent(SomeComponent)

    expect(React.isValidElement(element)).to.be.true
  })

  it('preserve component', function () {
    let element = Map.toComponent(<SomeComponent myProp='prop' />)

    expect(React.isValidElement(element)).to.be.true
    expect(element.props).to.be.eql({'myProp': 'prop'})
  })

  it('transform component factory into component', function () {
    let factory = (props, children) => {
      return (
        <SomeComponent myProp='prop' {...props}>{children}</SomeComponent>
      )
    }
    let element = Map.toComponent(factory)

    expect(element.props).to.be.eql({
      'myProp': 'prop', 'children': null
    })

    expect(React.isValidElement(element)).to.be.true
  })
})
