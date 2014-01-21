
var utils = require('../server/utils.js');

var SAVEFILE = process.env.SAVEFILE || "state.json";

var STATE = {
	base: Math.round(Math.random() * 100000),
	visits: 0,
};

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

	res.render('index', { 
		host: "verysha.re",
		description: "omgwtf",
		wow: wow,
		you_are: (STATE.visits + STATE.base).toFixed(0),
	});

	STATE.visits++;
};

