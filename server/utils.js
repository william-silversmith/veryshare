(function () {
	var fs = require('fs');

	module.exports.save = function (filepath, state) {
		fs.writeFile(filepath, JSON.stringify(state), function (err) {
			if (err) {
				console.log(err);
			}
		});
	};
})();