// Main Requirements
var $ = require('jquery');
var App = require('./app');
var Helpers = require('./utils/helpers');
require('respimage');
require('document-register-element');

// Modules
var Button = require('./modules/button/button');
var Sticky = require('./modules/sticky/sticky');
var EqualRows = require('./modules/equal-row-height/equal-row-heights');
var SlideFox = require('./modules/slide-fox/slide-fox');
var TypeAhead = require('./modules/type-ahead/views/typeAheadView');

// Web Components
require('./modules/carousel/init');
require('./modules/toggle/init');
require('./modules/overlay/init');


"use strict";

// TODO: Module Initialisation
$(document).ready(function() {
/**
	 * Sticky Header
	 */
	$('[data-js-module~="sticky"]').each(function() {
		var sticky = new Sticky({
			el: this,
			options: $(this).data('js-options')
		});

		sticky.init();
	});

	// Initialize EqualRows
	$('[data-js-module~="equal"]').each(function() {

		var equal = new EqualRows({
			el: $(this),
			options: $(this).data('js-options')
		});

		equal.render();

		if ($(this).data('js-options').delayInit) {
			$(window).load(function() {
				equal._reinit(equal);
			});
		}
	});

	// Initialize tyoe ahead
	$('[data-js-module="type-ahead"]').each(function() {
		new TypeAhead({
			el: $(this),
			options: $(this).data('js-options')
		});
	});
});
