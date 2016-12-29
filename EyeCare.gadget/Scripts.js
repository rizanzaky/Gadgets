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

function blinky(blinks) {
	return $.Deferred(function() {
		var self = this;
		var y_ = setInterval(function () {
			// var x_ = $("#head");
			if ($("#clock").css("visibility") === "visible") {
				$("#clock").css('visibility', 'hidden');
			}
			else {
				$("#clock").css('visibility', 'visible');
				if (--blinks <= 0) {
					clearInterval(y_);
					self.resolve();
				}
			}
		}, 500);
	});
}

function runTimer() {
	_playing = true;
	var nowTimeArr = $("#clock").text().split(":");
	var nextTime = getNext(1*nowTimeArr[0], 1*nowTimeArr[1]);
	if (nextTime == "00:00" || _pause) { // natural end || pause (stop play)
		_playing = false;
		if (!_pause) { // if not pause
			// _hitEnd = true;
			$("#clock").text(nextTime); // set 00:00
			// $("#debug").append("<span> l:" + loops + "</span>");
			looper();
		} else { // if pause
			$("#play-pause").text(">");
			// loops = $("#set-2").text();
		}
		return;
	}
	$("#clock").text(nextTime);
	setTimeout(runTimer, 1000);	// not considering function execution time
}

function looper() {
	// loops--;
	// breakTime = $("#set-3").text();
	// $("#clock").blinks()
	blinky(breakTime)
	.done(function() {
		if (--loops > 0) {
			// $("#clock").text($("#set-1").text() + ":00");
			$("#clock").text("00:05");
			runTimer();
		}
	});
}

$(document).ready(function() {
	$("#set-1").text("01"); // time
	$("#set-2").text("02"); // spins
	$("#set-3").text("05"); // break
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
		loops = $("#set-2").text();
		breakTime = $("#set-3").text();
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