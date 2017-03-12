/* eslint-env mocha */

import React from 'react'
import { PluginStore, Inject, InjectSlot } from '../src/index'
import { mount } from 'enzyme'
import { expect } from 'chai'

describe('<Inject />', function () {
  it('must be mountable', function () {
    mount(<Inject name='components.elements' />, {
      'context': {
        'pluginStore': new PluginStore.MutableStore()
      }
    })
  })

  it(
    'to render only an element if it has to inject a single element',
    function () {
      let store = new PluginStore.MutableStore()
      store.set('component', (<div className='lonely-element' />))

      let injection = mount(<Inject name='component' />, {
        'context': {
          'pluginStore': store
        }
      })

      expect(injection.find('.lonely-element')).to.have.length(1)
    }
  )

  it(
    [
      'render elements in a div if it has to inject multiple element',
      'without any children'
    ].join(' '),
    function () {
      let store = new PluginStore.MutableStore()
      store.push(
        'components',
        (<div className='element-1' />),
        (<div className='element-2' />),
        (<div className='element-3' />)
      )

      let injection = mount(<Inject name='components' />, {
        'context': {
          'pluginStore': store
        }
      })

      expect(injection.find('div .element-1')).to.have.length(1)
      expect(injection.find('div .element-2')).to.have.length(1)
      expect(injection.find('div .element-3')).to.have.length(1)
    }
  )

  it(
    'inject elements at the end of it\'s child by default',
    function () {
      let store = new PluginStore.MutableStore()
      store.push(
        'components',
        (<li className='first-injected' />),
        (<li className='second-injected' />),
        (<li className='third-injected' />)
      )

      let injection = mount(
        (
          <Inject name='components'>
            <ul>
              <li className='base' />
              <li className='base' />
              <li className='base' />
            </ul>
          </Inject>
        ),
        {
          'context': {
            'pluginStore': store
          }
        }
      )

      let resultOrder = [
        '.base', '.base', '.base', '.first-injected', '.second-injected',
        '.third-injected'
      ]

      expect(injection.find('ul').children().map(
        (element, index) => element.is(resultOrder[index]))
      ).to.be.eql([true, true, true, true, true, true])
    }
  )

  it(
    'can be configured with <InjectSlot />',
    function () {
      let store = new PluginStore.MutableStore()
      store.push(
        'components',
        (<li className='first-injected' />),
        (<li className='second-injected' />),
        (<li className='third-injected' />)
      )

      let injection = mount(
        (
          <Inject name='components'>
            <ul className='first'>
              <li className='base' />
              <ul className='second'>
                <InjectSlot inject={2} />
                <li className='base' />
              </ul>
              <li className='base' />
            </ul>
          </Inject>
        ),
        {
          'context': {
            'pluginStore': store
          }
        }
      )

      let firstOrder = ['.base', 'ul', '.base', '.third-injected']
      let secondOrder = ['.first-injected', '.second-injected', '.base']

      expect(injection.find('ul.first').children().map(
        (component, index) => component.is(firstOrder[index])
      ).reduce((a, b) => a && b)).to.be.true

      expect(injection.find('ul.second').children().map(
        (component, index) => component.is(secondOrder[index])
      ).reduce((a, b) => a && b)).to.be.true
    }
  )

  it(
    'do not dive further into other endpoints',
    function () {
      let store = new PluginStore.MutableStore()
      store.push(
        'components',
        (<li className='first-injected' />),
        (<li className='second-injected' />),
        (<li className='third-injected' />)
      )

      let injection = mount(
        (
          <Inject name='components'>
            <ul className='first'>
              <li className='base' />
              <ul className='second'>
                <Inject name='others'>
                  <InjectSlot inject={2} />
                </Inject>
                <InjectSlot inject={1} />
                <li className='base' />
              </ul>
              <li className='base' />
            </ul>
          </Inject>
        ),
        {
          'context': {
            'pluginStore': store
          }
        }
      )

      let firstOrder = ['.base', 'ul', '.base', '.second-injected', '.third-injected']
      let secondOrder = ['.first-injected', '.base']

      expect(injection.find('ul.first').children().map(
        (component, index) => component.is(firstOrder[index])
      ).reduce((a, b) => a && b)).to.be.true

      expect(injection.find('ul.second').children().map(
        (component, index) => {
          return index === 0 || component.is(secondOrder[index - 1])
        }
      ).reduce((a, b) => a && b)).to.be.true
    }
  )
})
