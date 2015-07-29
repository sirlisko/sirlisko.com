/*jshint latedef: nofunc */
'use strict';

var beacon = require('./beacon');

var ghost;

function gameOver() {
	ghost.removeEventListener('mouseover', ghostOver);

	document.querySelector('.life').classList.add('life--over');

	beacon('goodies', 'game over');
}

function ghostMove(e) {
	var ghostPosition = ghost.getBoundingClientRect();

	var offsetLeft = ghostPosition.left + document.body.scrollLeft;

	if (e.pageX > offsetLeft) {
		ghost.classList.remove('ghost--flipped');
	} else {
		ghost.classList.add('ghost--flipped');
	}

	ghost.style.left = e.pageX - 55 + 'px';
	ghost.style.bottom = window.innerHeight - (e.pageY + 55) + 'px';
}

function ghostOver() {
	var hearts = document.querySelectorAll('.life__heart:not(.life__heart--ko)');

	hearts[hearts.length - 1].classList.add('life__heart--ko');

	if (hearts.length === 1) {
		gameOver();
	}
}

ghost = document.querySelector('.ghost');

document.addEventListener('mousemove', ghostMove);

ghost.addEventListener('mouseover', ghostOver);
