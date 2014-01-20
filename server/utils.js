(function () {
	var fs = require('fs');

	module.exports.save = function (filepath, state) {
		fs.writeFile(filepath, JSON.stringify(state), function (err) {
			if (err) {
				console.log(err);
			}
		});
	};

	module.exports.load = function (filepath) {
		try {
			var data = fs.readFileSync(filepath, 'utf8');

			console.log(data);

			if (data) {
				data = JSON.parse(data);
			}
			else {
				data = {};
			}

			console.log('Loaded saved state.');
			return data;
		} 
		catch (e) {
			console.log('Unable to load saved state:\n' + e.message);
			throw e;
		}
	};
})();