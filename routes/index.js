
var statistics = require('../server/statistics.js');

/*
 * GET home page.
 */

exports.index = function (req, res) {
	res.render('index', { 
		host: "verysha.re",
		description: "omgwtf",

		you_are: Math.round(Math.random() * 100000).toFixed(0),
	});
};