/* eslint-env mocha */

import React from 'react'
import { Inject, InjectIn, InjectSlot, Kernel } from '../src/index'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'

describe('<Inject />', function () {
  let kernel = shallow(<Kernel />)

  kernel.instance().plugin('multiple', <div className='first-div' />)
  kernel.instance().plugin('multiple', <div className='second-div' />)
  kernel.instance().plugin('multiple', <div className='last-div' />)

  kernel.instance().plugin('big', <div className='div1' />)
  kernel.instance().plugin('big', <div className='div2' />)
  kernel.instance().plugin('big', <div className='div3' />)
  kernel.instance().plugin('big', <div className='div4' />)
  kernel.instance().plugin('big', <div className='div5' />)

  kernel.instance().plugin('alone', <div className='alone-div' />)

  it(
    'inject plugged components in it',
    function () {
      let inject = mount(
        <Inject name='multiple' />, {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.first-div')).to.have.length(1)
      expect(inject.find('.second-div')).to.have.length(1)
      expect(inject.find('.last-div')).to.have.length(1)
    }
  )

  it(
    'inject plugged component in place',
    function () {
      let inject = mount(
        <Inject name='alone' />, {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.html()).to.be.equal('<div class="alone-div"></div>')
    }
  )

  it(
    'do nothing without plugged component',
    function () {
      let inject = mount(
        <Inject name='nothing' />, {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.html()).to.be.equal(null)
    }
  )

  it(
    'inject plugged components in it\'s child if it exists',
    function () {
      let inject = mount(
        (
          <Inject name='multiple'>
            <div className='container' />
          </Inject>
        ), {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.container .first-div')).to.have.length(1)
      expect(inject.find('.container .second-div')).to.have.length(1)
      expect(inject.find('.container .last-div')).to.have.length(1)
    }
  )

  it(
    'inject plugged components in it\'s child if it exists',
    function () {
      let inject = mount(
        (
          <Inject name='alone'>
            <div className='container' />
          </Inject>
        ), {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.container .alone-div')).to.have.length(1)
    }
  )

  it(
    'inject nothing in it\'s child if no components are plugged',
    function () {
      let inject = mount(
        (
          <Inject name='nothing'>
            <div className='container' />
          </Inject>
        ), {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.container').children()).to.have.length(0)
    }
  )

  it(
    'inject components at the end of it\'s child component if it\'s child component has childrens',
    function () {
      let inject = mount(
        (
          <Inject name='multiple'>
            <div className='list'>
              <div className='first-item' />
              <div className='second-item' />
              <div className='last-item' />
            </div>
          </Inject>
        ), {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.list').children()).to.have.length(6)
      expect(inject.childAt(0).is('.first-item')).to.be.true
      expect(inject.childAt(1).is('.second-item')).to.be.true
      expect(inject.childAt(2).is('.last-item')).to.be.true
      expect(inject.childAt(3).is('.first-div')).to.be.true
      expect(inject.childAt(4).is('.second-div')).to.be.true
      expect(inject.childAt(5).is('.last-div')).to.be.true
    }
  )

  it(
    'can be configured with <InjectSlot /> components',
    function () {
      let inject = mount(
        (
          <Inject name='multiple'>
            <div className='list'>
              <div className='first-item' />
              <InjectSlot inject={2} />
              <div className='second-item' />
              <div className='last-item' />
            </div>
          </Inject>
        ), {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.list').children()).to.have.length(6)
      expect(inject.childAt(0).is('.first-item')).to.be.true
      expect(inject.childAt(1).is('.first-div')).to.be.true
      expect(inject.childAt(2).is('.second-div')).to.be.true
      expect(inject.childAt(3).is('.second-item')).to.be.true
      expect(inject.childAt(4).is('.last-item')).to.be.true
      expect(inject.childAt(5).is('.last-div')).to.be.true
    }
  )

  it(
    'can be configured with <InjectIn /> components',
    function () {
      let inject = mount(
        (
          <Inject name='big'>
            <div className='list'>
              <div className='first-item' />
              <InjectSlot inject={2} />
              <InjectIn inject={2}>
                <div className='second-item' />
              </InjectIn>
              <div className='last-item' />
            </div>
          </Inject>
        ), {
          'context': {
            'kernel': kernel.instance()
          }
        }
      )

      expect(inject.find('.list').children()).to.have.length(6)
      expect(inject.childAt(0).is('.first-item')).to.be.true
      expect(inject.childAt(1).is('.div1')).to.be.true
      expect(inject.childAt(2).is('.div2')).to.be.true
      expect(inject.childAt(3).is('.second-item')).to.be.true
      expect(inject.childAt(4).is('.last-item')).to.be.true
      expect(inject.childAt(5).is('.div5')).to.be.true
      expect(inject.find('.second-item').children()).to.have.length(2)
      expect(inject.find('.second-item').childAt(0).is('.div3')).to.be.true
      expect(inject.find('.second-item').childAt(1).is('.div4')).to.be.true
    }
  )
})
