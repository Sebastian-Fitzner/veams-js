define('ui.button', [
		'jquery',
		'backbone',
		'helpers',
		'App'
	],
	function ($, Backbone, Helpers, App) {

		App.ui.Button = Backbone.View.extend({
			// The options associated with this view
			options: {
				activeClass: 'is-active',
				passiveClass: false
			},

			events: {
				click: 'onClick'
			},

			// View constructor
			initialize: function (obj) {
				this.options = _.defaults(obj.options || {}, this.options); // get/set default options

				this._bindEvents();
			},

			_bindEvents: function () {
				this.listenTo(App.Vent, 'button:close', this.close);
				this.listenTo(App.Vent, 'button:open', this.open);
			},

			handleClasses: function () {
				this.$el.is('.' + this.options.activeClass) ? App.Vent.trigger('button:close', {
					'el': this.$el
				}) : App.Vent.trigger('button:open', {
					'el': this.$el
				});
			},

			close: function () {
				this.$el.removeClass(this.options.activeClass);

				if (this.options.context) this.$el.closest(this.options.context).removeClass(this.options.activeClass);

				if (Helpers.checkElementInContext(this.$el, this.options.context) && this.options.singleOpen === "true") {
					if (this.options.passiveClass && this.$el.hasClass(this.options.passiveClass)) {
						this.$el.removeClass(this.options.passiveClass);
					}
				}
			},

			open: function (obj) {
				if (Helpers.checkNodeEquality(this.$el[0], obj.el[0])) {
					this.$el.addClass(this.options.activeClass);

					if (this.options.passiveClass) {
						this.$el.removeClass(this.options.passiveClass);
					}

					if (this.options.context) this.$el.closest(this.options.context).addClass(this.options.activeClass);

				} else {
					if (Helpers.checkElementInContext(this.$el, this.options.context) && this.options.singleOpen === "true") {
						if (this.options.passiveClass && !this.$el.hasClass(this.options.passiveClass)) {
							this.$el.addClass(this.options.passiveClass).removeClass(this.options.activeClass);
						}
					}
				}
			},

			onClick: function (evt) {

				evt.preventDefault();

				if (typeof this.clickHandler === 'function') {
					this.clickHandler.apply(this, arguments);
					this.handleClasses();
				} else {
					console.log('You need to inherit from ' + this + ' and override the onClick method or pass a function to ' + this + '.clickHandler !');
				}
			},

			// Renders the view's template to the UI
			render: function () {

				// Maintains chainability
				return this;
			}

		});

		// Returns the View class
		return App.ui.Button;
	}
);
