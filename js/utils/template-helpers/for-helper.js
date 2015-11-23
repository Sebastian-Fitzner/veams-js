var Handlebars = require('handlebars/runtime')['default'];

module.exports = (function() {
	/*
	 * Loop helper.
	 *
	 * @return advanced for-loop
	 */
	Handlebars.registerHelper('for', function(from, to, incr, block) {
		var content = '';
		for (var i = from; i < to; i += incr)
			content += block.fn(i);
		return content;
	});

}).call(this);
