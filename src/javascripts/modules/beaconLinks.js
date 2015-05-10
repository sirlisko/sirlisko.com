/*global ga*/

'use strict';

function beacon(name) {
	ga('send', 'event', 'outgoing', name);
}

module.exports = function(){
	document.querySelector('.links').addEventListener('click', function (e) {
		if (e.target && e.target.nodeName === 'A') {
			beacon(e.target.parentNode.getAttribute('class'));
		}
	});
};
