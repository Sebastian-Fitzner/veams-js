var Handlebars = require('handlebars/runtime')['default'];

module.exports = (function() {
	/*
	 * Is helper.
	 *
	 * @return boolean
	 */
	Handlebars.registerHelper('is', function(value, test, options) {
		if (value === test) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

}).call(this);
