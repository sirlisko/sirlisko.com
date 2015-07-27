'use strict';

var test = require('tape');
var switchTitle = require('../src/javascripts/modules/switchTitle');

function createDOM() {
	document.body.innerHTML = '<div class="me__active me__intro--active"></div><div class="me__intro"><span>foo</span></div>';
}

test('the switch is done after 5s', function (t) {
	t.plan(4);

	createDOM();

	t.ok(document.querySelector('.me__active').classList.contains('me__intro--active'), 'me__active is active');
	t.notOk(document.querySelector('.me__intro span').classList.contains('me__intro--active'), 'the real me__intro is not active');

	switchTitle();

	setTimeout(function () {
		t.notOk(document.querySelector('.me__active').classList.contains('me__intro--active'), 'me__active is not active anymore');
		t.ok(document.querySelector('.me__intro span').classList.contains('me__intro--active'), 'the real me__intro is now active');
	}, 5000);
});
