/*global $*/

function twitterCallback(tweet) {
	'use strict';

	tweet = tweet[0].text
		.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1">$1</a>')
		.replace(/[@]+[A-Za-z0-9.-_]+/g, function (u) {
			var username = u.replace('@', '');
			return u.link('http://twitter.com/' + username);
		}).replace(/[#]+[A-Za-z0-9.-_]+/g, function (t) {
			var tag = t.replace('#', '%23');
			return t.link('http://search.twitter.com/search?q=' + tag);
		});

	$('.tweet p').html(tweet);
}

$.ajax('/twitter/', {
	dataType: 'json',
	success: twitterCallback
});
