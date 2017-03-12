/* eslint-env mocha */

import React, { Component } from 'react'
import { expect } from 'chai'
import { assign } from 'lodash'

import { Sort } from 'library'

function Require (...names) {
  return function (BaseClass) {
    let result = class extends BaseClass {}

    let required = {}

    for (let name of names) {
      required[name] = React.PropTypes.any
    }
    result.contextTypes = assign({}, BaseClass.contextTypes, required)

    return result
  }
}

function Expose (...names) {
  return function (BaseClass) {
    let result = class extends BaseClass {}

    let exposed = {}

    for (let name of names) {
      exposed[name] = React.PropTypes.any
    }

    result.childContextTypes = assign({}, BaseClass.childContextTypes, exposed)

    return result
  }
}

describe('Sort.byContextDependencies', function () {
  it('sort elements in regard of their context dependencies', function () {
    @Expose('FirstService')
    class FirstComponent extends Component { }

    @Expose('SecondService')
    @Require('FirstService')
    class SecondComponent extends Component { }

    @Require('SecondService')
    class ThirdComponent extends Component { }

    let sorted = Sort.byContextDependencies([
      <ThirdComponent />, <FirstComponent />, <SecondComponent />
    ])

    expect(sorted.map((element) => element.type)).to.be.eql([
      FirstComponent, SecondComponent, ThirdComponent
    ])
  })

  it('throw an error for circular context dependencies', function () {
    @Expose('FirstService')
    @Require('ThirdService')
    class FirstComponent extends Component { }

    @Expose('SecondService')
    @Require('FirstService')
    class SecondComponent extends Component { }

    @Require('SecondService')
    @Expose('ThirdService')
    class ThirdComponent extends Component { }

    expect(() => {
      Sort.byContextDependencies([
        <ThirdComponent />, <FirstComponent />, <SecondComponent />
      ])
    }).to.throw
  })
})
