import fakeEvent from 'simulant'

const $ = sel => document.querySelector(sel)
const $$ = sel => document.querySelectorAll(sel)

let stubType, stubAction

jest.mock('./beacon', () => (type, action) => {
  stubType = type
  stubAction = action
})

describe('testing ghost', () => {
  beforeEach(() => {
    require('./ghost.js')
  })

  afterEach(() => {
    document.body.innerHTML = ''
    jest.resetModules()
  })

  it('should remove lives on ghost mouseover', () => {
    const ghost = $('.ghost')
    expect($('.life__heart--ko')).toBeNull()

    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    expect($('.life__heart--ko')).not.toBeNull()

    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    expect($$('.life__heart--ko')).toHaveLength(2)
    expect($('.life').classList.contains('life--over')).toBeFalsy()

    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    expect($$('.life__heart--ko')).toHaveLength(3)
    expect($('.life').classList.contains('life--over')).toBeTruthy()
  })

  it('should trigger becaon on game over', function () {
    const ghost = $('.ghost')
    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    fakeEvent.fire(ghost, fakeEvent('mouseover'))
    fakeEvent.fire(ghost, fakeEvent('mouseover'))

    expect(stubType).toBe('goodies')
    expect(stubAction).toBe('game over')
  })

  it('should the ghost follow on mousemove', () => {
    const ghost = $('.ghost')
    ghost.style.position = 'absolute'
    ghost.style.left = '100px'
    ghost.style.top = '100px'

    fakeEvent.fire(ghost, 'mousemove', {screenX: 100})
    expect(ghost.style.left).toBe('45px')
    expect(ghost.style.top).toBe('-55px')
    expect(ghost.classList.contains('ghost--flipped')).not.toBeTruthy()

    ghost.style.left = '-100px'
    ghost.style.top = '-100px'

    fakeEvent.fire(ghost, 'mousemove', {screenX: -100})
    expect(ghost.style.left).toBe('-155px')
    expect(ghost.style.top).toBe('-55px')
    expect(ghost.classList.contains('ghost--flipped')).toBeTruthy()
  })
})
