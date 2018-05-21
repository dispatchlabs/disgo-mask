var alreadySetup = false;

document.addEventListener('DOMContentLoaded', function () {
	var thId = setInterval(function(){
		if (jQuery('#tab3-label').length) {
			jQuery('#tab3-label').on('click', function(){
				if (!alreadySetup) {
					setupStarWars();
				}
				jQuery(document.body).css("background-color", "black");
			});

			
			jQuery('#tab1-label').on('click', function(){
				jQuery(document.body).css("background-color", "white");
			});
			jQuery('#tab2-label').on('click', function(){
				jQuery(document.body).css("background-color", "white");
			});

			jQuery('#TxRunner').on('click', function(){
				runTx();
			});

			clearInterval(thId);
		}
	}, 100)
});

function setupStarWars() {
	function a() {
		var frames = [];
		var LINES_PER_FRAME = 14;
		var DELAY = 30;
		//star_wars is array of lines from 'js/star_wars.js'
		var lines = star_wars.length;
		for (var i=0; i<lines; i+=LINES_PER_FRAME) {
			frames.push(star_wars.slice(i, i+LINES_PER_FRAME));
		}
		var stop = false;
		//to show greetings after clearing the terminal
		function greetings(term) {
			term.echo('STAR WARS ASCIIMACTION\n'+
					'Simon Jansen (C) 1997 - 2008\n'+
					'www.asciimation.co.nz\n\n'+
					'type "play" to start animation, '+
					'press CTRL+D to stop');
		}
		function play(term, delay) {
			var i = 0;
			var next_delay;
			if (delay == undefined) {
				delay = DELAY;
			}
			function display() {
				if (i == frames.length) {
					i = 0;
				}
				term.clear();
				if (frames[i][0].match(/[0-9]+/)) {
					next_delay = frames[i][0] * delay;
				} else {
					next_delay = delay;
				}
				term.echo(frames[i++].slice(1).join('\n')+'\n');
				if (!stop) {
					setTimeout(display, next_delay);
				} else {
					term.clear();
					greetings(term);
					i = 0;
				}
			}
			display();
		}
		function stopNow() {
			stop = true;
		}

		window.stars = $('#starwarsterm').terminal(function(command, term){
			if (command == 'play') {
				term.pause();
				stop = false;
				play(term);
			}
			else if (command == 'stopNow') {
				term.pause();
				stop = true;
				play(term, 0);
			}
			else if (command == "greetings") {
				greetings(term);
			}
		}, {
			width: 500,
			// height: 0,style="width: 500px; height: 300px;"
			prompt: '#> ',
			greetings: "aaaaaaaaaaaa",
			onInit: function(term) {
				term.exec("play");
				// term.exec("greetings");
			},
			keypress: function(e, term) {
				if (e.which == 100 && e.ctrlKey) {
					stop = true;
					term.resume();
					return false;
				}
			}
		});
	};

	a();

	// window.stars.exec("play");
}

function runTx() {
    chrome.storage.sync.get({
        serverWithPort: ""
    }, function (items) {
		var serverWithPort = items.serverWithPort;
		var txAsJson = jQuery("#TxAsJson").val();
		jQuery
		.post(
			serverWithPort + "/v1/transactions", 
			txAsJson,
			function(data, status, jqXHR) {
				chrome.notifications.create("", {
					type: "basic",
					iconUrl: "success.png",
					title: "Disgo Mask",
					message: JSON.stringify(data)
				});

				jQuery("#TxResult").val(JSON.stringify(data));
            },
            "json"
		)
		.done(function(data) {
			chrome.notifications.create("", {
				type: "basic",
				iconUrl: "success.png",
				title: "Disgo Mask",
				message: JSON.stringify(data)
			});

			jQuery("#TxResult").val(JSON.stringify(data));
		})
		.fail(function(jqxhr, settings, ex) {
			chrome.notifications.create("", {
				type: "basic",
				iconUrl: "error.png",
				title: "Disgo Mask",
				message: JSON.stringify(ex)
			});

			jQuery("#TxResult").val(JSON.stringify(ex));
		});
    });
}