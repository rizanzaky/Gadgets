// jQuery.support.cors = true;

var CEILING = 15;
var CEILING_SECS = CEILING * 60;
var _playing = false;
var _pause = false;
var _hitEnd = false;
var loops = 0; breakTime = 0;

function getNext(mins, secs) {
	if (secs <= 0 && mins <= 0)
		return "00:00";
	if (secs <= 0)
		return ((mins < 11) ? "0"+(mins-1) : (mins-1)) + ":59";
	return ((mins < 10) ? ("0"+mins) : mins) + ":" + ((secs < 11) ? "0"+(secs-1) : (secs-1));
}

$.fn.blink = function (options) {
	var defaults = { delay: 500, blinks: Infinity };
	var options = $.extend(defaults, options);
	return $(this).each(function (idx, itm) {
		var blinkLoop = setInterval(function () {
			if ($(itm).css("visibility") === "visible") {
				$(itm).css('visibility', 'hidden');
			}
			else {
				$(itm).css('visibility', 'visible');
				if (options.blinks != Infinity)
					if (options.blinks-- <= 0) clearInterval(blinkLoop);
			}
		}, options.delay);
	});
}

$.fn.blinky = function (options) {
	var dfd = $.Deferred();

	var defaults = { delay: 500, blinks: Infinity };
	var options = $.extend(defaults, options);
	return $(this).each(function (idx, itm) {
		var blinkLoop = setInterval(function() {
			dfd.resolve(function () {
				if ($(itm).css("visibility") === "visible") {
					$(itm).css('visibility', 'hidden');
				}
				else {
					$(itm).css('visibility', 'visible');
					if (options.blinks != Infinity)
						if (options.blinks-- <= 0) clearInterval(blinkLoop);
				}
			});
		}, options.delay);
	});
}

function runTimer() {
	_playing = true;
	var nowTimeArr = $("#clock").text().split(":");
	var nextTime = getNext(1*nowTimeArr[0], 1*nowTimeArr[1]);
	if (nextTime == "00:00" || _pause) {
		_playing = false;
		if (!_pause) {
			_hitEnd = true;
			$("#clock").text(nextTime);
			$("#debug").append("<span> l:" + loops + "</span>");
			if (loops > 1) {
				looper();
			} else {
				$("#play-pause").text(">");
				loops = $("#set-2").text();
			}
		}
		return;
	}
	$("#clock").text(nextTime);
	setTimeout(runTimer, 1000);	// not considering function execution time
}

function looper() {
	loops--;
	var deferred = $.Deferred();
	deferred.resolve(function() {
		$("#clock").blink({blinks: breakTime});
	});
	deferred.done(function() {
		$("#clock").text("00:05");
	});

	// $("#clock").text($("#set-1").text() + ":00");
	// $.when( $("#clock").blink({blinks: breakTime}) ).done(function() {
	// 	$("#clock").text("00:05");
	// 	// runTimer();
	// });
	// $("#clock").blink({blinks: breakTime}).then(function() {
	// 	$("#clock").text("00:05");
	// 	// runTimer();
	// });
	// $("#clock").text("00:10");
	// runTimer();
}

function loopTimer(loops) {
	breakTime = $("#set-3").text();
	console.log(loops); console.log(breakTime);
	this.runTimer().complete(function() {
		if (_hitEnd)
			$("#clock").blink({blinks: breakTime});
	});
	// for (var i = loops; i > 1; i--) {
	// 	if (_hitEnd)
	// 		$("#clock").blink({blinks: 0});
			// runTimer();
			// .complete(function() {
			// for (var j = breakTime; j > 0; j--) {
			// 	$("#clock").css('visibility', 'hidden');
			// 	$("#clock").css('visibility', 'visible');
			// 	// setTimeout(function() {
			// 	// 	$("#clock").css('visibility', 'hidden');
			// 	// 	setTimeout($("#clock").css('visibility', 'visible'), 500);
			// 	// }, 500);
			// 	// $("#clock").css('visibility', 'visible');
			// 	console.log("done " + j)
			// }
			// $("#clock").text($("#set-1").text() + ":00");
		// });
	// }
}

$(document).ready(function() {
	$("#set-1").text("01");
	$("#set-2").text("02");
	$("#set-3").text("05");
	// $("#clock").text($("#set-1").text() + ":00");
	$("#clock").text("00:05");
	// $("#clock").blink({blinks: 10});
	loops = $("#set-2").text();
	breakTime = $("#set-3").text();
	// $("#debug").append("<span> lp:" + loops + "</span>");

	$("#play-pause").on("click", function() {
		if (!_playing) {
			_pause = false;
			$(this).text("=");
			runTimer();
		} else {
			_pause = true;
			$(this).text(">");
		}
	})

	$("#stop").on("click", function() {
		_pause = true;
		// $("#clock").text($("#set-1").text() + ":00");
		$("#clock").text("00:05");
		$("#play-pause").text(">");
	})

	$(".value-up").on("click", function() {
		var id = "#" + $(this).attr("set-id");
		// var oldValue = parseInt($(id).text()) + 1;
		var oldValue = 1 + 1 * $(id).text();
		var newValue = oldValue < 10 ? "0"+oldValue : oldValue;
		$(id).text(newValue);
		$("#clock").text($("#set-1").text() + ":00");
	});

	$(".value-down").on("click", function() {
		var id = "#" + $(this).attr("set-id");
		// var oldValue = parseInt($(id).text()) - 1;
		var oldValue = $(id).text() - 1;
		var newValue = oldValue < 10 ? "0"+oldValue : oldValue;
		if (oldValue < 1)
			newValue = "01";
		$(id).text(newValue);
		$("#clock").text($("#set-1").text() + ":00");
	});
});