
var utils = require('../server/utils.js');
var redis_module = require('redis');
var redis = redis_module.createClient(6385, 'redis.veryshare.us');

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

		if (STATE.base > 30000) {
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
			host: "veryshare.us",
			description: "omgwtf",
			wow: wow,
			you_are: (visits + STATE.base).toFixed(0),
		});
	});

	STATE.visits++;
	redis.incr('visits');
};

