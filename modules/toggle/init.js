define('ui.toggle-init', [
		'jquery',
		'App',
		'ui.toggle'
	],
	function($, App, Toggle) {

		"use strict";

		var ui = App.ui;

		ui.ToggleInit = Object.create(HTMLElement.prototype);

		ui.ToggleInit.options = {};

		ui.ToggleInit.View = null;

		ui.ToggleInit.createdCallback = function() {
			var options;
			this.options = $(this).data('js-options');
			options = this.options;
			this.View = new Toggle({
				el: $(this),
				options: this.options
			});
		};

		ui.ToggleInit.attachedCallback = function() {
			this.View.render();
		};

		ui.ToggleInit.detachedCallback = function() {
			this.View.remove();
		};

		ui.ToggleInit.attributeChangedCallback = function(name, previousValue, value) {
			// implement code for handling attribute changes
		};

		document.registerElement('ui-toggle', {
			prototype: ui.ToggleInit
		});

		return ui.ToggleInit;

	});
