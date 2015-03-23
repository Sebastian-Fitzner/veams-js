define('ui.button-init', [
		'jquery',
		'App',
		'ui.button'
	],
	function($, App, Button) {

		"use strict";

		var ui = App.ui;

		ui.ButtonInit = Object.create(HTMLElement.prototype);

		ui.ButtonInit.options = {};

		ui.ButtonInit.View = null;

		ui.ButtonInit.createdCallback = function() {
			var options;
			this.options = $(this).data('js-options');
			options = this.options;
			this.View = new Button({
				el: $(this),
				options: this.options
			});

			this.View.clickHandler = function() {
				App.Vent.trigger(options.globalEvent, {
					el: this.$el,
					options: options
				});
			};
		};

		ui.ButtonInit.attachedCallback = function() {
			this.View.render();
		};

		ui.ButtonInit.detachedCallback = function() {
			this.View.remove();
		};

		ui.ButtonInit.attributeChangedCallback = function(name, previousValue, value) {
			// implement code for handling attribute changes
		};

		document.registerElement('ui-button', {
			prototype: ui.ButtonInit
		});

		return ui.ButtonInit;

	});
