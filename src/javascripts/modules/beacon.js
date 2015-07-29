/*global ga*/
'use strict';

function beacon(type, name) {
	ga('send', 'event', type, name);
}

module.exports = beacon;
