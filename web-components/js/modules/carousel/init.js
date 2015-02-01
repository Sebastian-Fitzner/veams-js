define('ui.carousel-init', ['jquery', 'App', 'ui.carousel'], function($, App, Carousel) {

	"use strict";

	var ui = App.ui;

	ui.CarouselInit = Object.create(HTMLElement.prototype);

	ui.CarouselInit.options = {};

	ui.CarouselInit.View = null;


	ui.CarouselInit.createdCallback = function() {
		$(this).append('<div class="spinner" data-js-atom="spinner">' +
			'<div class="spinner-db1"></div>' +
			'<div class="spinner-db2"></div>' +
			'</div>');
		this.options = $(this).data('js-options');
		this.View = new Carousel({
			el: $(this),
			options: this.options
		});
	};

	ui.CarouselInit.attachedCallback = function() {
		// this.View.render();
	};

	ui.CarouselInit.detachedCallback = function() {
		this.View.remove();
	};

	ui.CarouselInit.attributeChangedCallback = function(name, previousValue, value) {
		// implement code for handling attribute changes
	};

	document.registerElement('ui-carousel', {
		prototype: ui.CarouselInit
	});

	return ui.CarouselInit;

});
