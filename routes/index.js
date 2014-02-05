
var utils = require('../server/utils.js');
var redis_module = require('redis');

var REDIS_HOST = process.env.APPENV === 'PRODUCTION'
	? 'redis.veryshare.us'
	: 'localhost';

var redis = redis_module.createClient(6385, REDIS_HOST);

redis.on('error', function (error) {
	console.log("Redis Error: " + error);
});

var SAVEFILE = process.env.SAVEFILE || "state.json";

var STATE = {
	base: 0,
	visits: 0,
};

redis.get('base', function (err, value) {
	if (err) {
		console.log(err);
	}
	else {
		value = parseInt(value, 10);

		if (STATE.base < 10000000) {
			STATE.base = value;
		}
	}
});

try {
	STATE = utils.load(SAVEFILE);
}
catch (e) {}

setInterval(function () {
	try {
		utils.save(SAVEFILE, STATE);
		console.log("Saved state @ " + new Date());
	}
	catch (e) {
		console.log(e.message);
	}
}, 60000);


/*
 * GET home page.
 */

var wows = [
	'wow',
	'such',
	'very',
	'much',
	'so',
];

var HOST = 'veryshare.us';
var DESCRIPTION = "Such wonder! Such share! Very share. Connect with each other through the act of sharing. What can the power of sharing reveal?";

exports.index = function (req, res) {
	var wow = utils.random_choice(wows);

	redis.get('visits', function (err, visits) {
		if (err) {
			console.log(err);
		}

		if (visits > 4000000) {
			visits = 0;
		}

		visits = parseInt(visits, 10);
		res.render('index', { 
			host: HOST,
			description: DESCRIPTION,
			wow: wow,
			you_are: (visits + STATE.base).toFixed(0),
		});
	});

	STATE.visits++;
	redis.incr('visits');
};

exports.share_your_voice = function (req, res) {
	res.render('share_your_voice', { 
		host: HOST,
		description: DESCRIPTION,
	});
};


// API

exports.powershare = function (req, res) {
	var data = req.body;
	
	if (data.powershares) {
		var numshare = parseInt(data.powershares, 10);

		redis.incr('powershares');
		redis.get('max_powershares', function (err, max_powershares) {
			if (err) {
				console.log(err);
			}

			max_powershares = parseInt(max_powershares, 10);

			if (numshare > max_powershares) {
				redis.set('max_powershares', max_powershares);
			}
		});

		res.end("true");
	}

	res.end("false");
};

exports.shared = function (req, res) {
	var data = req.body;

	redis.incr('shares');

	if (data.facebook) {
		redis.incr('share-facebook');
	}
	else if (data.twitter) {
		redis.incr('share-twitter');
	}
	else if (data.tumblr) {
		redis.incr('share-tumblr');	
	}
	else if (data.googleplus) {
		redis.incr('share-googleplus');	
	}
	else if (data.pinterest) {
		redis.incr('share-pinterest');
	}
	else if (data.reddit) {
		redis.incr('share-reddit');
	}
	else if (data.email) {
		redis.incr('share-email');
	}

	res.end("true");
};

exports.rewardseen = function (req, res) {
	redis.incr('reward-seen');
	res.end("true");
};



