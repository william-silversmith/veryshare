(function () {
	var fs = require('fs');

	function save (filepath, state) {
		fs.writeFile(filepath, JSON.stringify(state), function (err) {
			if (err) {
				console.log(err);
			}
		});
	};

	function load (filepath) {
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

	function random_choice (array) {
		var index = random_integer(array.length - 1);
		return array[index];
	};

	function random_integer (max) {
		return Math.round(Math.random() * max);
	};

	module.exports = {
		save: save,
		load: load,
		random_choice: random_choice,
		random_integer: random_integer,
	};
})();