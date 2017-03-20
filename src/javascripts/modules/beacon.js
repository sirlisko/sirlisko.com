/* global ga */

function beacon (category, action, label, value, fieldsObject) {
  ga('send', 'event', category, action, label, value, fieldsObject)
}

function onClick ({ target }) {
  target.getAttribute('data-beacon') !== undefined && beacon(
    'outbound',
    'click',
    target.getAttribute('href'),
    {
      transport: 'beacon',
      hitCallback: () => { document.location = target.getAttribute('href') }
    })
}

document.addEventListener('click', onClick)
