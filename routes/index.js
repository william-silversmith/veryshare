
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
}, 2000);


/*
 * GET home page.
 */

exports.index = function (req, res) {
	res.render('index', { 
		host: "verysha.re",
		description: "omgwtf",

		you_are: (STATE.visits + STATE.base).toFixed(0),
	});

	STATE.visits++;
};