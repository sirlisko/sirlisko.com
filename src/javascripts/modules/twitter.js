
'use strict';

function twitterCallback(tweet) {
	tweet = tweet[0].text
		.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1">$1</a>')
		.replace(/[@]+[A-Za-z0-9.-_]+/g, function (u) {
			var username = u.replace('@', '');
			return u.link('http://twitter.com/' + username);
		}).replace(/[#]+[A-Za-z0-9.-_]+/g, function (t) {
			var tag = t.replace('#', '%23');
			return t.link('http://search.twitter.com/search?q=' + tag);
		});

	document.querySelector('.tweet__message').innerHTML = tweet;
}

module.exports = function(){
	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			var data = JSON.parse(httpRequest.responseText);
			twitterCallback(data);
		}
	};

	httpRequest.open('GET', '/twitter/');
	httpRequest.send();
};
