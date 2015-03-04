/*global _gaq*/

(function () {
	'use strict';

	function switchTitle() {
		var descriptions = document.querySelectorAll('.me__intro span');

		var randomPosition = Math.floor(Math.random() * descriptions.length);

		document.querySelector('.me__intro--active').classList.remove('me__intro--active');

		descriptions[randomPosition].classList.add('me__intro--active');
	}

	setInterval(switchTitle, 5000);

	document.querySelector('.links').addEventListener('click', function (e) {
		if (e.target && e.target.nodeName === 'A') {
			_gaq.push(['_trackEvent', 'outgoing', e.target.parentNode.getAttribute('class')]);
		}
	});
})();
