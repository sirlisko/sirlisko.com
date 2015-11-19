'use strict';

var test = require('tape');
var fakeEvent = require('simulant');

test('testig outgoing beacon on anchor click', function (t) {
	t.plan(4);

	window.ga = function(send, event, category, action){
		t.equal(send, 'send', 'google action');
		t.equal(event, 'event', 'google type');
		t.equal(category, 'outgoing', 'the category is outgoing');
		t.equal(action, 'foo', 'the beacon is correct');
	};

	document.body.innerHTML = '<div data-beacon="foo"></div>';

	require('../src/javascripts/modules/beacon');

	fakeEvent.fire(document.querySelector('[data-beacon]'), fakeEvent('click'));
});
