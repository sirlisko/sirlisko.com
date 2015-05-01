/*global ga*/

(function () {
	'use strict';

	function beacon(name) {
		ga('send', 'event', 'outgoing', name);
	}

	document.querySelector('.links').addEventListener('click', function (e) {
		if (e.target && e.target.nodeName === 'A') {
			beacon(e.target.parentNode.getAttribute('class'));
		}
	});
})();
