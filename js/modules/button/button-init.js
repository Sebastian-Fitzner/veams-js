/**
 * @module initButton
 *
 * @author Sebastian Fitzner
 */

var App = require('../../app');
var $ = App.$;
var ButtonView = require('./button');

var Button = function(obj) {
	this.el = obj.el;
	this.$el = $(obj.el);

	this.options = obj.options;
	this.initialize();
};

Button.prototype.initialize = function() {
	var _this = this;

	_this.button = new ButtonView({
		el: this.$el,
		options: this.options
	});

	_this.button.clickHandler = function() {
		App.Vent.trigger(_this.options.globalEvent, {
			el: _this.$el,
			options: _this.options
		});
	};

};

Button.prototype.render = function() {
	this.button.render();
};

module.exports = Button;
