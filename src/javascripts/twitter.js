/*global jQuery, Siutsur*/

(function($){
	"use strict";

	Siutsur.load('353168929520230401', function(obj) {
		$('.tweet .baloon').html(obj[0].title.regular);
	}, function() {});

})(jQuery);