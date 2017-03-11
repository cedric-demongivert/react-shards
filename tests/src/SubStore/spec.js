/* eslint-env mocha */

import { expect, spy } from 'chai'

const filter = (x) => x < 3
let parentCalls = {
  'set': {
    'substoreParams': ['endpoints.first', [1, 2, 3, 4]],
    'parentParams': [
      'endpoints.substore.endpoints.first'.split('.'),
      [1, 2, 3, 4]
    ]
  },
  'push': {
    'substoreParams': ['endpoints.second', 1, 2, 3, 4],
    'parentParams': [
      'endpoints.substore.endpoints.second'.split('.'),
      1, 2, 3, 4
    ]
  },
  'clear': {
    'substoreParams': ['endpoints.first'],
    'parentParams': ['endpoints.substore.endpoints.first'.split('.')]
  },
  'delete': {
    'substoreParams': ['endpoints.second', 1, 4],
    'parentParams': ['endpoints.substore.endpoints.second'.split('.'), 1, 4]
  },
  'filter': {
    'substoreParams': ['endpoints.second', filter],
    'parentParams': [
      'endpoints.substore.endpoints.second'.split('.'), filter
    ]
  },
  'get': {
    'substoreParams': ['endpoints.second'],
    'parentParams': ['endpoints.substore.endpoints.second'.split('.')]
  },
  'endpoints': {
    'substoreParams': ['endpoints.second'],
    'parentParams': ['endpoints.substore.endpoints.second'.split('.')]
  },
  'has': {
    'substoreParams': ['endpoints.second'],
    'parentParams': ['endpoints.substore.endpoints.second'.split('.')]
  }
}

export function isSubStore (createParent, createStore) {
  for (let parentMethod in parentCalls) {
    it(
      'call parent\'s #' + parentMethod + ' with an absolute endpoint',
      function () {
        let parentStore = createParent()
        let store = createStore(parentStore, 'endpoints.substore')

        for (let parentMethod in parentCalls) {
          parentStore[parentMethod] = spy(parentStore[parentMethod])
        }

        let params = parentCalls[parentMethod].substoreParams
        let parentParams = parentCalls[parentMethod].parentParams
        store[parentMethod](...params)

        expect(parentStore[parentMethod]).to.have.been.called.once
        expect(parentStore[parentMethod]).to.have.been.called.with(
          ...parentParams
        )
      }
    )
  }
}
