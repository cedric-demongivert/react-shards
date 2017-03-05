/* eslint-env mocha */

import { PluginStore } from 'library'
import { expect } from 'chai'

describe('PluginStore', function () {
  it('must be instanciable', function () {
    let store = new PluginStore()
    expect(store).to.not.be.null
  })

  describe('#set', function () {
    it('allow to set a value for an endpoint and to retrieve it', function () {
      let store = (new PluginStore()).set('endpoints', 'azerty')
                                     .set('endpoints.first', 2)
                                     .set(['endpoints', 'second'], [1, 2, 3])

      expect(store.get('endpoints.first')).to.be.equal(2)
      expect(store.get(['endpoints', 'second'])).to.be.eql([1, 2, 3])
      expect(store.get(['endpoints'])).to.be.equal('azerty')
    })
  })
})
