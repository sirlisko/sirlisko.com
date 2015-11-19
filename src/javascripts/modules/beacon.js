/*global ga*/
'use strict';

function beacon(category, action) {
	ga('send', 'event', category, action);
}

document.addEventListener('click', function(e, bcn){
	if ((bcn = e.target.getAttribute('data-beacon'))) {
		beacon('outgoing', bcn);
	}
});

module.exports = beacon;
