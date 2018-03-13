import fakeEvent from 'simulant'
import './beacon'

describe('testig beacon', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should be triggered on data-beacon click', () => {
    global.ga = function (send, event, category, action, label, value) {
      expect(send).toBe('send')
      expect(event).toBe('event')
      expect(category).toBe('outbound')
      expect(action).toBe('click')
      expect(label).toBe('#foo')
      value.hitCallback()
    }
    document.body.innerHTML = '<a href="#foo" data-beacon></a>'

    fakeEvent.fire(document.querySelector('[data-beacon]'), fakeEvent('click'))
  })
})
