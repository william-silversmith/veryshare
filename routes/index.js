
/*
 * GET home page.
 */

exports.index = function (req, res) {
  res.render('index', { 
  	you_are: Math.round(Math.random() * 100000).toFixed(0),
  });
};