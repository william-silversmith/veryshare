
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

var HOST = 'veryshare.us';
var DESCRIPTION = "omgwtf";	

exports.index = function (req, res) {
	var wow = utils.random_choice(wows);

	res.render('index', { 
		host: HOST,
		description: DESCRIPTION,
		wow: wow,
		you_are: (STATE.visits + STATE.base).toFixed(0),
	});

	STATE.visits++;
};

exports.share_your_voice = function (req, res) {
	res.render('share_your_voice', { 
		host: HOST,
		description: DESCRIPTION,
	});
};





