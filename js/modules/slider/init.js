var $ = require('jquery');
var App = require('../../app');
var Slider = require('./ui-slider');

"use strict";

var ui = App.ui;

ui.SliderInit = Object.create(HTMLElement.prototype);

ui.SliderInit.options = {};

ui.SliderInit.View = null;


ui.SliderInit.createdCallback = function() {};

ui.SliderInit.attachedCallback = function() {
	this.options = $(this).data('js-options');

	this.View = new Slider({
		el: $(this),
		options: this.options
	}).render();
};

ui.SliderInit.detachedCallback = function() {
	if (!this.View) return;

	this.View.remove();
};

ui.SliderInit.attributeChangedCallback = function(name, previousValue, value) {
	// implement code for handling attribute changes
};

document.registerElement('ui-slider', {
	prototype: ui.SliderInit
});

module.exports = ui.SliderInit;
