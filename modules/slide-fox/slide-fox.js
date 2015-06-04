/**
 * @module Slide Fox
 *
 * @author Andy Gutsche
 */

var $ = require('jquery');
var App = require('../../app');
var Helpers = require('../../utils/helpers');

var SlideFox = function(obj) {
	this.el = obj.el;
	this.$el = $(obj.el);

	this.options = {
		visibleClass: 'is-visible'
	};

	this.options = Helpers.defaults(obj.options || {}, this.options);
};

SlideFox.prototype.init = function() {
	this.bindEvents();
	Helpers.isInViewport(this.$el) ? this.showSlideFox() : this.hideSlideFox();
};

SlideFox.prototype.bindEvents = function() {
	var that = this;

	App.Vent.on('scroll', function(e) {
		Helpers.isInViewport(that.$el) ? that.showSlideFox() : that.hideSlideFox();
	});
};

SlideFox.prototype.showSlideFox = function() {
	this.$el.addClass(this.options.visibleClass);
};

SlideFox.prototype.hideSlideFox = function() {
	this.$el.removeClass(this.options.visibleClass);
};

// Returns the constructor
module.exports = SlideFox;
