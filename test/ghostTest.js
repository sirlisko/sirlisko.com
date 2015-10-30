'use strict';

var test = require('tape');
var fakeEvent = require('simulant');

window.ga = function(){}; //TODO: mock the external dependecy

document.body.innerHTML =
	'<section class="ghost">' +
		'<figure class="ghost__body"></figure>' +
	'</section>' +
	'<section class="life">' +
		'<p class="life__heart"></p>' +
		'<p class="life__heart"></p>' +
		'<p class="life__heart"></p>' +
	'</section>';

require('../src/javascripts/modules/ghost');

test('on ghost mouseover lives are removed', function (t) {
	t.plan(6);

	t.notOk(document.querySelector('.life__heart--ko'), 'full life, life__heart--ko is not present');

	var ghost = document.querySelector('.ghost');
	fakeEvent.fire(ghost, fakeEvent('mouseover'));
	t.ok(document.querySelector('.life__heart--ko'), 'one life is missing, life__heart--ko is present');

	fakeEvent.fire(ghost, fakeEvent('mouseover'));
	t.equal(document.querySelectorAll('.life__heart--ko').length, 2, 'two lives are missing, life__heart--ko is present 2 times');
	t.notOk(document.querySelector('.life').classList.contains('life--over'), 'life is not over yet, life--over is not present');

	fakeEvent.fire(ghost, fakeEvent('mouseover'));
	t.equal(document.querySelectorAll('.life__heart--ko').length, 3, 'three lives are missing, life__heart--ko is present 3 times');
	t.ok(document.querySelector('.life').classList.contains('life--over'), 'life is over, life--over is present');
});

test('on mousemove the ghost is moving following it', function (t) {
	t.plan(6);

	var ghost = document.querySelector('.ghost');
	ghost.style.position = 'absolute';
	ghost.style.left = '100px';
	ghost.style.bottom = '100px';

	fakeEvent.fire(ghost, fakeEvent('mousemove'));

	t.equal(ghost.style.left, '-55px', 'the ghost moved in the X axis');
	t.equal(ghost.style.bottom, window.innerHeight - 55 + 'px', 'the ghost moved in the Y axis');
	t.ok(ghost.classList.contains('ghost--flipped'), 'the ghost is moving on the left (flipped)');

	ghost.style.left = '-100px';
	ghost.style.bottom = '-100px';

	fakeEvent.fire(ghost, fakeEvent('mousemove'));

	t.equal(ghost.style.left, '-55px', 'the ghost moved in the X axis');
	t.equal(ghost.style.bottom, window.innerHeight - 55 + 'px', 'the ghost moved in the Y axis');
	t.notOk(ghost.classList.contains('ghost--flipped'), 'the ghost is moving on the right (not flipped)');
});
