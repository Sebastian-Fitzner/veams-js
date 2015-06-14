var Helpers = require('../../utils/helpers');
var App = require('../../app');
var $ = App.$;
var SelectFx = require('../select/select');

var Form = function (obj) {
	this.el = obj.el;
	this.$el = $(obj.el);

	this.options = {};

	this.options = Helpers.defaults(obj.options || {}, this.options);
	this.initialize();
};

Form.prototype.initialize = function () {
	this.form = this.$el.find('form');
};


Form.prototype.render = function () {
	$('select', this.$el).each(function () {
		new SelectFx({
			el: $(this),
			options: $(this).data('js-options')
		});
	});
};

// Returns constructor
module.exports = Form;