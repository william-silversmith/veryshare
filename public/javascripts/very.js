
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);


;(function ($, undefined) {
	"use strict"; 

	var _audioclips = [];
	var next_clip = 0;

	var NUMCLIPS = 15;

	var _sharecount = 0;
	var _critical_share_count = 1;

	var _reward_mode = {
		init: false,
		active: false,
		button_text: 'WOW!',
		titles: ["Such Reward!", "WOW", "? ? ? ? ? ?", "What's that?!", "Such Wonder!"],
		original_title: document.title,
	};

	var _flags = {
		blink: true,
		vibrate: true,
	};

	var _share_clicked_timer = null;
	var _original_text = $('#main').text();

	var _social_index = 0;
	var _social_networks = [
		{ name: 'Facebook', data: "facebook", url: 'https://www.facebook.com/sharer.php?u=#{VERYSHARE}&t=#{TITLE}&s=#{DESCRIPTION}', img: "facebook.png" },
		{ name: 'Twitter', data: "twitter", url: 'http://twitter.com/intent/tweet?source=sharethiscom&text=#{DESCRIPTION}&url=#{VERYSHARE}', img: "twitter.png" },
		
		// Need to think about Tumblr and Reddit
		{ name: 'Tumblr', data: "tumblr", url: 'http://www.tumblr.com/share?v=3&u=#{VERYSHARE}&t=#{TITLE}&s=#{DESCRIPTION}', img: "tumblr.png" },
		//{ name: 'Reddit', data: "reddit", url: 'https://www.facebook.com/sharer.php?u=#{VERYSHARE}&t=#{TITLE}&s=#{DESCRIPTION}', img: "reddit.png" },
		
		{ name: 'Pinterest', data: "pinterest", url: 'http://pinterest.com/pin/create/button/?url=#{VERYSHARE}&media=http://#{VERYSHARE}/#{MEDIA}&description=#{DESCRIPTION}', img: "pinterest.png" },
		{ name: 'Google Plus', data: "googleplus", url: 'https://plus.google.com/share?url=#{VERYSHARE}', img: "googleplus.png" },
		{ name: 'Email', data: "email", url: 'mailto:myfriends@example.com?subject=#{TITLE}&body=#{DESCRIPTION}', img: "email.png" },
	];

	$(document).ready(function() {
		shareButtonConfiguration();
		configureAudio();

		$('#youshared').alwaysCenterIn(window, {
			direction: 'horizontal',
		});
	});

	function configureAudio () {
		var choices = range(1, NUMCLIPS);

		for (var i = 0; i < 7; i++) {
			var random_index = random_integer(choices.length - 1);
			var clip_id = choices[random_index];
			choices.splice(random_index, 1);

			clip_id = clip_id.toFixed(0);

			var clip = new Audio("/audio/veryshare-" + clip_id + ".wav");
			clip.preload = true;

			// Fix for apple not preloading
			if ($.browser.iproduct) {
				_audioclips.push(clip);
			}
			else {
				$(clip).one('canplaythrough', (function (bound_clip) {
					return function () {
						_audioclips.push(bound_clip);
					};
				}(clip)));
			}
		}

		$('#share').click(function () {
			if (_sharecount < _critical_share_count) {
				playStupidSound();
				shareOnSelectedNetwork({
					title: "Wow! So share.",
					description: "Share with your friends! You'll make so many.",
					media: "/images/veryshare.png",
				});

				$('#social').fadeOut(200);
			}

			_sharecount++;

			if (_sharecount >= _critical_share_count) {
				_reward_mode.init = true;
			}

			if (_reward_mode.init && !_reward_mode.active) {
				rewardModeStepOne();
			}

			return false;
		})
		.mousedown(function () {
			// Pulsate animation conflicts with activate/deactivate
			// animations on the same element
			if (!$.browser.mobile) {
				$(this).removeClass('pulsate');
			}
		});
	}

	function rewardModeStepThree () {
		var img = $("<img>")
				.addClass('reward-1')
				.attr('src', '/images/doge-sun-meme.jpg');

		$('#share, #youare').hide();
		
		$.blotIn.off(function () {
			$.post('/1.0/reward-seen');
		});

		$('#youshared')
			.centerIn(window, { direction: 'horizontal' })
			.fadeIn(200, function () {
				$(this).centerIn(window, { direction: 'horizontal' });
			})
			.text("You powershared " + powersharecounter + " times!")
			.click(function () {
				var timestr = (powersharecounter === 1) ? ' time' : ' times';

				shareOnSelectedNetwork({
					title: "Wow!!! POWERSHARE.",
					description: "I POWERSHARED " + powersharecounter + timestr +  " on Very Share! Think you can beat me?",
					media: "/images/veryshare.png",
				}) 
			});

		$('#rewardtext')
			.alwaysCenterIn(window, { direction: 'horizontal' })
			.fadeIn(200, function () {
				$(this).centerIn(window, { direction: 'horizontal' })
			})
			.html("It was me all along!<br>Thanks for sharing fellow shibe, it's for my health! &hearts;");

		$('#again')
			.alwaysCenterIn(window, { direction: 'horizontal' })
			.fadeIn(200, function () {
				$(this).centerIn(window, { direction: 'horizontal' })
			})
			.click(function () {
				location.reload();
			});

		var doge = $('<img>').attr('src', '/images/doge-sun-meme.jpg');
		$('#container').append(doge);
		doge.load(function () {
			doge.alwaysCenterIn(window)
		});
	}

	function rewardModeStepTwo() {
		$('#share')
			.addClass('green reward')
			.removeClass('fadeToRed fadeToGreen')
			.off('click');
		
		if (!$.browser.mobile) {
			$('#share').addClass('pulsate');
		}

		_flags.blink = false;
		_flags.vibrate = false;

		$('#main').fadeChangeText('So Share!');
				
		playStupidSound();
		$.blotIn(rewardModeStepThree);
	}

	function rewardModeStepOne() {
		$('#share')
			.off('click')
			.on('click', function () {
				playStupidSound();
				powerShare(rewardModeStepTwo);
				appear_doge_word();
			})
			.one('click', function () {
				_share_clicked_timer = clearInterval(_share_clicked_timer);
				$('#main').fadeChangeText('GO FAST!');
			});

		$('#next').hide();

		if (!$.browser.mobile) {
			$('#share').addClass('pulsate');
		}

		$('#main').fadeChangeText(_reward_mode.button_text);

		var counter = 0;
		var attntimer = setInterval(function () {
			if (counter % 2) {
				document.title = random_choice(_reward_mode.titles);
			}
			else {
				document.title = _reward_mode.original_title;
			}

			counter++;
		}, 1500);


		setTimeout(function () {
			$(document).one('mouseover', function () {
				clearInterval(attntimer);
				document.title = _reward_mode.original_title;
			});
		}, 1000);
	}

	var powermodetimer = null;
	var powermode = false;
	var powercolors = {
		border: ColorUtils.hexToRGB("#1F7F27"),
		background: ColorUtils.hexToRGB("#17B83E"),
	};

	var powersharecounter = 0;

	function powerShare (fn) {
		if (powermodetimer) {
			powermodetimer = clearTimeout(powermodetimer);
		}

		powersharecounter++;
		powercolors.border = ColorUtils.rotate(-0.5, powercolors.border);;
		powercolors.background = ColorUtils.rotate(-0.5, powercolors.background);

		$('#share')
			.css('border-color', ColorUtils.rgbToHex(powercolors.border))
			.css('background-color', ColorUtils.rgbToHex(powercolors.background));

		if (!powermode) {
			$('#share')
				.removeClass('fadeToRed')
				.addClass('green fadeToGreen')
				.animationend(function (evt) {
					$('#share')
						.addClass('green')
						.removeClass('fadeToGreen');
				});
			powermode = true;
		}

		powermodetimer = setTimeout(function () {
			powermodetimer = null;
			powermode = false;

			$('#share')
				.removeClass('green fadeToRed')
				.css('border-color', '')
				.css('background-color', '');
			
			if (!$.browser.mobile) {
				$('#share').addClass('pulsate');
			}

			$.post('/1.0/power-share', { powershares: powersharecounter });

			if (fn) {
				fn();
			}
		}, 1500);
	}

	function shareOnSelectedNetwork (args) {
		args = args || {};

		var socialnetwork = _social_networks[_social_index];
		
		var url = socialnetwork.url.format_url({
			VERYSHARE: HOST,
			TITLE: args.title,
			DESCRIPTION: args.description,
			MEDIA: args.media,
		});

		var payload = {};
		payload[socialnetwork.data] = true;
		$.post('/1.0/shared', payload);

		// Too dangerous for prototype phase

		// var win = window.open(url, '_blank');
		// win.focus();
	}

	function advanceSelectedNetwork () {
		_social_index = (_social_index + 1) % _social_networks.length;
		var next_network = _social_networks[_social_index];

		$('#social img')
			.attr('src', '/images/' + next_network.img)
			.attr('title', next_network.name)
			.attr('alt', next_network.name);

		$('#social').cssAnimation('social-switch-network');
	}

	function playStupidSound () {
		if (_share_clicked_timer) {
			_share_clicked_timer = clearInterval(_share_clicked_timer);
			clickMeBlinkDisplay({ 
				initial_delay: 5000
			});
		}

		if (_audioclips.length === 0) {
			return;
		}

		var clipindex = next_clip % _audioclips.length;
		var selectedclip = _audioclips[clipindex];
		next_clip++; // must occur before play otherwise there's a race condition

		selectedclip.play();
	}

	function shareButtonConfiguration () {
		
		$('#container').css('height', $(window).innerHeight());
		$(window).on('resize', function () {
			$('#container').css('height', $(window).innerHeight());
		});

		$('#share').alwaysCenterIn();

		$('#next').alwaysCenterIn(window, {
			direction: 'horizontal'
		});

		if (!$.browser.mobile) {
			$('#share').addClass('pulsate');
		}

		/* This complicated timing is necessary to ensure
		   that the button firstly: correctly centered on page load,
		   centered on page resize, and that the shake doesn't
		   perturb it too much after returning from another tab. */
		setTimeout(function () {
			$('#share')
				.centerIn()
				.fadeIn(1000, function () {
					$('#main').alwaysCenterIn();
				});

			$('#social').alwaysCenterIn('#share', { direction: 'horizontal' });
			$('#main').centerIn();
		}, 300);

		buttonSize();
		$(window).on('resize', buttonSize);
		
		setTimeout(function () { 
			shakaroo($('#share')); 
		}, 500);

		setInterval(function() {
			if (!($('#share').is(':hover'))
				&& _flags.vibrate) {

				shakaroo($('#share'));
			}
		}, Math.round((Math.random() * 5000) + 4500));

		$('#next')
			.mouseover(function () {
				$('#social').addClass('hover');
			})
			.mouseout(function () {
				$('#social').removeClass('hover');
			})
			.click(advanceSelectedNetwork);

		clickMeBlinkDisplay({ 
			initial_delay: 3000
		});		
	}

	function buttonSize() {
		var share_min_size = 200;

		var window_min_side = Math.min($(window).innerHeight(), $(window).innerWidth());
		var share_diameter = Math.max(window_min_side * 0.4, share_min_size);

		var bordersize = Math.max(share_diameter * 0.08, 18);

		$('#share')
			.css('width', share_diameter)
			.css('height', share_diameter)
			.css('border-width', bordersize + 'px');

		var fontsize = 2.5;
		fontsize *= share_diameter / share_min_size;

		$('#main').css('font-size', fontsize + "em");

		var social_min_size = 35;
		var social_diameter = Math.max(share_diameter * 0.175, social_min_size);

		$('#social')
			.css('width', social_diameter)
			.css('height', social_diameter);
	}

	/* clickMeBlinkDisplay
	 *
	 * Switches the text of the button to "Click Me!"
	 * or some such briefly.
	 *
	 * Optional:
	 *   initial_delay: msec delay before executing the first switch
	 *   repeat_delay: 
	 *
	 * Returns: void
	 */
	function clickMeBlinkDisplay (args) {
		args = args || {};
		var initial_delay = args.initial_delay || 0;
		var repeat_delay = args.releat_delay || 7000;

		var switcher = function () {
			if (!_flags.blink) {
				return;
			}

			var randomtxt = ['Share Me!'];
			if (_reward_mode.init) {
				randomtxt = ['? ? ? ?', "Mystery?", "What?"];
			}

			var text = random_choice(randomtxt);

			$('#main').fadeChangeText(text, 1250, function () {
				var txt = _reward_mode.init 
					? _reward_mode.button_text 
					: _original_text;

				$('#main').fadeChangeText(txt);
			});
		};

		setTimeout(function () {
			switcher();
			_share_clicked_timer = setInterval(switcher, repeat_delay);
		}, initial_delay);
	}

	function shakaroo (element) {
		var bool = Math.round(Math.random()); // true/false

		var direction = bool 
			? 'up' 
			: 'left';
		
		var diameter = $('#share').width();
		
		if (_flags.vibrate) {
			$(element).effect('shake', {
				times: 7, 
				distance: 3,
				direction: direction,
				complete: function () {
					element.centerIn()
				}
			}, 10);
		}
	}

	function random_choice (array) {
		var index = random_integer(array.length);
		return array[index];
	};

	function random_integer (max) {
		return Math.floor(Math.random() * max);
	}

	function range (from, to, incr) {
		var rng = [];

		incr = incr || 1;

		for (var i = from; i <= to; i += incr) {
			rng.push(i);
		}

		return rng;
	}

	var _phrases = [
		'such WOW!', 'WOW!', 'wow', 'such share',
		'much viral', 'such amaze', 'very share',
		'such wonder!', 'such legit', 'many friend',
		'die squirrel', 'such inspire', 'much inspire',
		'such surprise'
	];

	function appear_doge_word () {
		var item = $('<div>')
			.addClass('dogeitem')
			.text(random_choice(_phrases));

		var h = Math.floor($(window).innerHeight() * Math.random());
		var w = Math.floor($(window).innerWidth() * Math.random());

		item.css('top', h).css('left', w);

		var fontsize = 0.5 + (2 * Math.random());
		item.css('font-size', fontsize.toFixed(1) + "em");

		var hexcolor = Math.floor(Math.pow(255, 3) * Math.random()).toString(16);
		item.css('color', '#' + hexcolor);

		$('body').append(item);

		item.delay(1500).fadeOut(1000, function () {
			$(this).remove();
		});
	}

	String.prototype.format_url = function (fmt) {
		Object.keys(fmt).forEach(function (key) {
			fmt[key] = encodeURIComponent(fmt[key]);
		});

		return this.format(fmt);
	};

	String.prototype.format = function (fmt) {
		var str = this;
		Object.keys(fmt).forEach(function (key) {
			str = str.replace(new RegExp('#\{' + key + '\}', 'g'), fmt[key])
		});

		return str;
	};

	$.fn.cssAnimation = function (css_class) {
		$(this)
			.addClass(css_class)
			.animationend(function () {
				$(this).removeClass(css_class);
			});

		return this;
	};

	$.fn.animationend = function (fn) {
		return $(this).one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', fn);
	};

	$.fn.fadeChangeText = function (text, cb_wait, callback) {
		var timedcb;
		if (callback) {
			timedcb = function () {
				setTimeout(callback, cb_wait);
			};
		}
		
		$(this).fadeOut(200, function () {
			$(this)
				.text(text)
				.centerIn()
				.fadeIn(200, timedcb);
		});
	};

	$.fn.delayedCenterIn = function () {
		var that = $(this);
		setTimeout(function () {
			that.centerIn();
		}, 10);

		return this;
	};

	$.browser = $.browser || {};
	$.browser.iproduct = /ipad|iphone/i.test(navigator.userAgent);

})(jQuery);
