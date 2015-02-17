/*global _gaq, jQuery*/
(function ($) {
	'use strict';

	var $ghost = $('.ghost');

	$(document).on('mousemove', function (e) {
		var offset = $ghost.offset();
		if (e.pageX > offset.left) {
			$ghost.removeClass('ghost--flipped');
		} else {
			$ghost.addClass('ghost--flipped');
		}

		$ghost.css({
			left: e.pageX - 55,
			bottom: window.innerHeight - (e.pageY + 55)
		});
	});

	$ghost.on('mouseover', function () {
		var $heart = $('.life__heart:not(.life__heart--ko)');

		$heart.last().addClass('life__heart--ko');

		if ($heart.length === 1) {
			$('.life').addClass('life--over');
			_gaq.push(['_trackEvent', 'goodies', 'game over', 'Finished Ghost Game']);
		}
	});
})(jQuery);
