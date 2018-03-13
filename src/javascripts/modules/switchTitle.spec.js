import { useFakeTimers } from 'sinon'

describe('testing switchTitle', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should switch after 5s', () => {
    const fakeTimer = useFakeTimers()
    document.body.innerHTML = '<div class="me__active me__intro--active"></div><div class="me__intro"><span>foo</span></div>'

    expect(document.querySelector('.me__active').classList.contains('me__intro--active')).toBeTruthy()
    expect(document.querySelector('.me__intro span').classList.contains('me__intro--active')).not.toBeTruthy()

    require('./switchTitle')

    fakeTimer.tick(5001)

    expect(document.querySelector('.me__active').classList.contains('me__intro--active')).not.toBeTruthy()
    expect(document.querySelector('.me__intro span').classList.contains('me__intro--active')).toBeTruthy()

    fakeTimer.restore()
  })
})
