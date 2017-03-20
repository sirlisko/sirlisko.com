/* eslint-env mocha */

import 'jsdom-global/register'
import { expect } from 'chai'
import { useFakeTimers } from 'sinon'

describe('testing switchTitle', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should switch after 5s', () => {
    const fakeTimer = useFakeTimers()
    document.body.innerHTML = '<div class="me__active me__intro--active"></div><div class="me__intro"><span>foo</span></div>'

    expect(document.querySelector('.me__active').classList.contains('me__intro--active')).to.be.equal(true)
    expect(document.querySelector('.me__intro span').classList.contains('me__intro--active')).to.be.not.equal(true)

    require('./switchTitle')

    fakeTimer.tick(5001)

    expect(document.querySelector('.me__active').classList.contains('me__intro--active')).to.be.not.equal(true)
    expect(document.querySelector('.me__intro span').classList.contains('me__intro--active')).to.be.equal(true)

    fakeTimer.restore()
  })
})
