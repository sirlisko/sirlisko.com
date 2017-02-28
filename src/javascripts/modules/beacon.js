/* global ga */
'use strict'

function beacon (category, action, label, value, fieldsObject) {
  ga('send', 'event', category, action, label, value, fieldsObject)
}

function beaconOutbound (e) {
  if ((e.target.getAttribute('data-beacon') !== undefined)) {
    var url = e.target.getAttribute('href')
    beacon('outbound', 'click', url, {
      transport: 'beacon',
      hitCallback: function () { document.location = url }
    })
  }
}

document.addEventListener('click', beaconOutbound)

module.exports = beacon
