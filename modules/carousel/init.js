var $ = require('jquery');
var App = require('../../app');
var Carousel = require('./ui-carousel');

"use strict";

var ui = App.ui;

ui.CarouselInit = Object.create(HTMLElement.prototype);

ui.CarouselInit.options = {};

ui.CarouselInit.View = null;


ui.CarouselInit.createdCallback = function() {
	this.options = $(this).data('js-options');
};

ui.CarouselInit.attachedCallback = function() {
	this.View = new Carousel({
		el: $(this),
		options: this.options
	});
};

ui.CarouselInit.detachedCallback = function() {
	if (!this.View) return;

	this.View.remove();
};

ui.CarouselInit.attributeChangedCallback = function(name, previousValue, value) {
	// implement code for handling attribute changes
};

document.registerElement('ui-carousel', {
	prototype: ui.CarouselInit
});

module.exports = ui.CarouselInit;
