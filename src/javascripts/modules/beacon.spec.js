/* eslint-env mocha */

import 'jsdom-global/register'
import { expect } from 'chai'
import fakeEvent from 'simulant'
import './beacon'

describe('testig beacon', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should be triggered on data-beacon click', () => {
    global.ga = function (send, event, category, action, label, value) {
      expect(send).to.be.equal('send')
      expect(event).to.be.equal('event')
      expect(category).to.be.equal('outbound')
      expect(action).to.be.equal('click')
      expect(label).to.be.equal('foo')
      value.hitCallback()
    }
    document.body.innerHTML = '<a href="foo" data-beacon></a>'

    fakeEvent.fire(document.querySelector('[data-beacon]'), fakeEvent('click'))
  })
})
