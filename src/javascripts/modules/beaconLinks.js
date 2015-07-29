'use strict';

var beacon = require('./beacon');

function clickLink(e) {
	if (e.target && e.target.nodeName === 'A') {
		beacon('outgoing', e.target.parentNode.getAttribute('class'));
	}
}

document.querySelector('.links').addEventListener('click', clickLink);
