/* eslint-env mocha */

import 'jsdom-global/register'
import { expect } from 'chai'
import fakeEvent from 'simulant'
import proxyquire from 'proxyquire'

const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)

var stubType, stubAction

describe('testing ghost', () => {
  beforeEach(() => {
    proxyquire('./ghost', {
      './beacon': (type, action) => {
        stubType = type
        stubAction = action
        return true
      }
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should remove lives on ghost mouseover', () => {
    const ghost = $('.ghost')
    expect($('.life__heart--ko')).to.be.equal(null)

    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    expect($('.life__heart--ko')).to.be.not.equal(null)

    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    expect($$('.life__heart--ko').length).to.be.equal(2)
    expect($('.life').classList.contains('life--over')).to.be.equal(false)

    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    expect($$('.life__heart--ko').length).to.be.equal(3)
    expect($('.life').classList.contains('life--over')).to.be.equal(true)
  })

  it('should trigger becaon on game over', function () {
    const ghost = $('.ghost')
    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    fakeEvent.fire(ghost, fakeEvent('mouseover'))

    expect(stubType).to.be.equal('goodies')
    expect(stubAction).to.be.equal('game over')
  })

  it('should the ghost follow on mousemove', () => {
    const ghost = $('.ghost')
    ghost.style.position = 'absolute'
    ghost.style.left = '100px'
    ghost.style.top = '100px'

    fakeEvent.fire(ghost, 'mousemove', {screenX: 100})
    expect(ghost.style.left).to.be.equal('45px')
    expect(ghost.style.top).to.be.equal('-55px')
    expect(ghost.classList.contains('ghost--flipped')).to.be.not.equal(true)

    ghost.style.left = '-100px'
    ghost.style.top = '-100px'

    fakeEvent.fire(ghost, 'mousemove', {screenX: -100})
    expect(ghost.style.left).to.be.equal('-155px')
    expect(ghost.style.top).to.be.equal('-55px')
    expect(ghost.classList.contains('ghost--flipped')).to.be.equal(true)
  })
})
