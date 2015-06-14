/**
 * @module Slide Fox
 *
 * @author Andy Gutsche
 */

var Helpers = require('../../utils/helpers');
var App = require('../../app');
var $ = App.$;

var SlideFox = function(obj) {
	this.el = obj.el;
	this.$el = $(obj.el);

	this.options = {
		visibleClass: 'is-visible'
	};

	this.options = Helpers.defaults(obj.options || {}, this.options);

	this.initialize();
};

SlideFox.prototype.initialize = function() {
	this.bindEvents();
};

SlideFox.prototype.bindEvents = function() {
	App.Vent.on('scroll', this.render.bind(this));
};

SlideFox.prototype.showSlideFox = function() {
	this.$el.addClass(this.options.visibleClass);
};

SlideFox.prototype.hideSlideFox = function() {
	this.$el.removeClass(this.options.visibleClass);
};

SlideFox.prototype.render = function () {
	Helpers.isInViewport(this.$el) ? this.showSlideFox() : this.hideSlideFox();
};

// Returns the constructor
module.exports = SlideFox;
