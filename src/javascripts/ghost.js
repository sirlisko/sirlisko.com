/*global ga*/
(function () {
	'use strict';

	var ghost = document.querySelector('.ghost');

	document.addEventListener('mousemove', function (e) {
		var ghostPosition = ghost.getBoundingClientRect();

		var offset = {
			top: ghostPosition.top + document.body.scrollTop,
			left: ghostPosition.left + document.body.scrollLeft
		};

		if (e.pageX > offset.left) {
			ghost.classList.remove('ghost--flipped');
		} else {
			ghost.classList.add('ghost--flipped');
		}

		ghost.style.left = e.pageX - 55 + 'px';
		ghost.style.bottom = window.innerHeight - (e.pageY + 55) + 'px';
	});

	ghost.addEventListener('mouseover', function () {
		var hearts = document.querySelectorAll('.life__heart:not(.life__heart--ko)');

		hearts[hearts.length - 1].classList.add('life__heart--ko');

		if (hearts.length === 1) {
			document.querySelector('.life').classList.add('life--over');
			ga('send', 'event', 'goodies', 'game over', 'Finished Ghost Game');
		}
	});
})();
