define('ui.button', [
		'jquery',
		'backbone',
		'App'
	],
	function($, Backbone, App) {

		App.ui.Button = Backbone.View.extend({
			// The options associated with this view
			options: {},

			events: {
				click: 'onClick'
			},

			// View constructor
			initialize: function(obj) {
				this.options = _.defaults(obj.options || {}, this.options); // get/set default options
			},

			onClick: function(evt) {
				var that = this;

				evt.preventDefault();

				if (typeof this.clickHandler === 'function') {
					this.clickHandler.apply(this, arguments);
				} else {
					console.log('You need to inherit from ' + this + ' and override the onClick method or pass a function to ' + this + '.clickHandler !');
				}
			},

			// Renders the view's template to the UI
			render: function() {

				// Maintains chainability
				return this;
			}

		});

		// Returns the View class
		return App.ui.Button;
	}
);
