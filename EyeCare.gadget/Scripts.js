/* EYE CARE - Windows Desktop Gadget 
	* Version: 1.0.0
	* Owner: Rizan Zaky
	* Contributors: Rizan Zaky
	* Description: Windows gadget to help with 20-20-20 rule
	* Free and Open Source application
*/

var dev = false;

// flag variables
var _playing = false;
var _pause = false;
var _stop = false;
var _blinking = false;
var _minimized = false;

var loops = 0; breakTime = 0;

function getNext(mins, secs) {
	if (secs <= 0 && mins <= 0)
		return "00:00";
	if (secs <= 0)
		return ((mins < 11) ? "0"+(mins-1) : (mins-1)) + ":59";
	return ((mins < 10) ? ("0"+mins) : mins) + ":" + ((secs < 11) ? "0"+(secs-1) : (secs-1));
}

function blink(blinks) {
	return $.Deferred(function() {
		var self = this;
		var blinker = setInterval(function () {
			if (_stop) {
				loops = 0;
				$("#clock").css('visibility', 'visible');
				clearInterval(blinker);
				self.resolve();
				return;
			}

			if ($("#clock").css("visibility") === "visible") {
				$("#clock").css('visibility', 'hidden');
			}
			else {
				$("#clock").css('visibility', 'visible');
				if (--blinks <= 0) {
					clearInterval(blinker);
					self.resolve();
					return;
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
			$("#clock").text(nextTime); // set 00:00
			looper();
		} else { // if pause
			$("#play-pause-img").attr("src", "./img/play.png");
		}
		return;
	}
	$("#clock").text(nextTime);
	setTimeout(runTimer, 1000);	// not considering function execution time
}

function looper() {
	_blinking = true;
	blink(breakTime).done(function() {
		_blinking = false;
		if (--loops > 0) { // if looping
			if (dev) $("#clock").text("00:05");
			else $("#clock").text($("#set-1").text() + ":00");
			runTimer();
		} else { // if loop end
			stopReset();
		}
	});
	playSound();
}
function increment(element, step) {
	var id = '#' + element.attr("set-id");
	var incValue = step + 1 * $(id).text();
	var newValue = incValue < 10 ? "0"+incValue : incValue;
	$(id).text(newValue);
}
function decrement(element, step) {
	var id = '#' + element.attr("set-id");
	var decValue = $(id).text() - step;
	var newValue = decValue < 10 ? "0"+decValue : decValue;
	if (decValue < 1) return;
	$(id).text(newValue);
}

function stopReset() {
	_pause = true; _stop = true; // pause true makes _playing false
	loops = $("#set-2").text();
	breakTime = $("#set-3").text();
	if (dev) $("#clock").text("00:05");
	else $("#clock").text($("#set-1").text() + ":00");
	$("#play-pause-img").attr("src", "./img/play.png");
}

function playSound() {
	System.Sound.playSound("teatime.wav");
}

$(document).ready(function() {
	$("#set-1").text("01"); // time
	$("#set-2").text("01"); // spins
	$("#set-3").text("05"); // break
	if (dev) $("#clock").text("00:05");
	else $("#clock").text($("#set-1").text() + ":00");
	loops = $("#set-2").text();
	breakTime = $("#set-3").text();

	$("#play-pause").on("click", function() {
		if (_blinking) return;
		if (!_playing) { // play
			_pause = false; _stop = false;
			$("#play-pause-img").attr("src", "./img/pause.png");
			runTimer();
		} else { // pause
			_pause = true;
			$("#play-pause-img").attr("src", "./img/play.png");
		}
	})

	$("#stop").on("click", function() {
		stopReset();
	})

	$("#value-up-1").on("click", function() {
		increment($(this), 1);
		$("#clock").text($("#set-1").text() + ":00");
	});

	$("#value-up-2").on("click", function() {
		increment($(this), 1);
		loops = $("#set-2").text();
	});

	$("#value-up-3").on("click", function() {
		increment($(this), 5);
		breakTime = $("#set-3").text();
	});

	$("#value-down-1").on("click", function() {
		decrement($(this), 1);
		$("#clock").text($("#set-1").text() + ":00");
	});

	$("#value-down-2").on("click", function() {
		decrement($(this), 1);
		loops = $("#set-2").text();
	});

	$("#value-down-3").on("click", function() {
		decrement($(this), 5);
		breakTime = $("#set-3").text();
	});

	$("#window-btn").on("click", function() {
		if (_minimized) {
			_minimized = false;
			$("body").css("height", "140px");
			$(".window-size").css("height", "5px");
			$("#setting-btns").show();
			$(this).find("img").attr("src", "./img/minimise.png");
			return;
		}
		_minimized = true;
		$("body").css("height", "50px");
		$(".window-size").css("height", "10px");
		$("#setting-btns").hide();
		$(this).find("img").attr("src", "./img/maximise.png");
	})
});