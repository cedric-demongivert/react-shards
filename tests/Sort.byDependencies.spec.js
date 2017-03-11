/* eslint-env mocha */

import { Sort } from 'library'

import { expect } from 'chai'

describe('Sort.byDependencies', function () {
  it('sort elements in regard of their dependencies', function () {
    let elements = [
      {
        'name': 'second-element',
        'after': ['first-element']
      },
      {
        'name': 'last-element',
        'after': ['second-element']
      },
      {
        'name': 'first-element',
        'after': [null]
      }
    ]

    let getDependencies = (element) => element.after
    let getServices = (element) => [element.name]

    let sorted = Sort.byDependencies({getDependencies, getServices}, elements)

    expect(sorted.map((element) => element.name)).to.be.eql([
      'first-element', 'second-element', 'last-element'
    ])
  })

  it('throw an error for circular dependencies', function () {
    let elements = [
      {
        'name': 'second-element',
        'after': ['first-element']
      },
      {
        'name': 'last-element',
        'after': ['second-element']
      },
      {
        'name': 'first-element',
        'after': ['last-element']
      }
    ]

    let getDependencies = (element) => element.after
    let getServices = (element) => [element.name]

    expect(() => {
      Sort.byDependencies({getDependencies, getServices}, elements)
    }).to.throw
  })
})
