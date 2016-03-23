'use strict';

var test = require('tape');
var fakeEvent = require('simulant');

test('testig outgoing beacon on anchor click', function (t) {
	t.plan(5);

	window.ga = function(send, event, category, action, label){
		t.equal(send, 'send', 'google action');
		t.equal(event, 'event', 'google type');
		t.equal(category, 'outbound', 'the category is outgoing');
		t.equal(action, 'click', 'the action is correct');
		t.equal(label, 'foo', 'the label contains the url');
	};

	document.body.innerHTML = '<a href="foo" data-beacon></a>';

	require('../src/javascripts/modules/beacon');

	fakeEvent.fire(document.querySelector('[data-beacon]'), fakeEvent('click'));
});
