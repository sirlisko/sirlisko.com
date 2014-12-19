/*global _gaq, jQuery*/

(function ($) {
	'use strict';

	function switchTitle() {
		var $descriptions = $('.me__intro span');

		var randomPosition = Math.floor(Math.random() * $descriptions.length);

		$('.me__intro--active').removeClass();

		$descriptions.eq(randomPosition).addClass('me__intro--active');
	}

	setInterval(switchTitle, 5000);

	$('.links').on('click', 'li', function () {
		_gaq.push(['_trackEvent', 'outgoing', $(this).attr('class')]);
	});

})(jQuery);
