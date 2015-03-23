/**
 * @module sticky
 *
 * @author Sebastian Fitzner
 */

define([
		'jquery',
		'underscore',
		'App'
	],
	function($, _, App) {

		var Sticky = function(obj) {
			this.el = obj.el;
			this.$el = $(obj.el);
			this.height = this._getHeight(this.$el);
			this.top = this._getTopPosition(this.$el);

			this.options = {
				stickyClass: 'is-sticky',
				fixedClass: 'is-fixed',
				hiddenClass: 'is-hidden',
				offset: false,
				setWidth: true
			};

			this.options = _.defaults(obj.options || {}, this.options);
		};

		Sticky.prototype._getHeight = function(el) {
			return el.attr('data-js-height', el.outerHeight());
		};

		Sticky.prototype._getTopPosition = function(el) {
			return el.offset().top;
		};

		Sticky.prototype.init = function() {
			this._addCustomDiv();
			this._setWidth();
			this._bindEvents();
			if (this.options.offset) this.options.offset = this._getStickysHeight();

			App.Vent.trigger('sticky:init');
		};

		Sticky.prototype._addCustomDiv = function() {
			this.$el.before('<div class="is-clone" style="height: 0"/>');
		};

		Sticky.prototype._setWidth = function() {
			this.$el.removeAttr('style');

			var width = this.$el.outerWidth();

			this.$el.css('width', width);
		};

		Sticky.prototype._bindEvents = function() {
			var _this = this;

			$(window).scroll(function() {
				_this._stickIt();
			});

			App.Vent.on('resize', _.debounce(function() {
				_this._setWidth();
			}), 300);

			App.Vent.on('navigation:open', this._addFixed, this);
			App.Vent.on('navigation:close', this._removeFixed, this);
		};

		Sticky.prototype._getStickysHeight = function() {
			var height = 0;
			$('[data-js-module="sticky"]').each(function() {
				height += $(this).outerHeight();
			});
			return height;
		};

		Sticky.prototype._stickIt = function() {
			var windowTop = $(window).scrollTop();
			var offset = this.top + this.height;

			if (windowTop > offset) {
				if (this.options.offset) {
					this.options.offset = this._getStickysHeight();
				}
				this._setHeight(this.height);
				this._addActive();
			} else {
				this._setHeight('0');
				this._removeActive();
			}

			App.Vent.trigger('sticky:changed');
		};

		Sticky.prototype._setHeight = function(height) {
			this.$el.prev().css('height', height);
		};

		Sticky.prototype._addActive = function() {
			this.$el.addClass(this.options.stickyClass);

			if (this.options.offset) this.$el.css({
				top: this.options.offset - this.height
			});

			App.Vent.trigger('sticky:active');
		};

		Sticky.prototype._removeActive = function() {
			this.$el.removeClass(this.options.stickyClass);

			App.Vent.trigger('sticky:inactive');
		};

		Sticky.prototype._addFixed = function() {
			this._setHeight(this.height);
			this.$el.addClass(this.options.fixedClass).css('width', '100%');
			App.Vent.trigger('sticky:fixed');
		};

		Sticky.prototype._removeFixed = function() {
			this._setHeight('0');
			this.$el.removeClass(this.options.fixedClass);
			this._setWidth();
			App.Vent.trigger('sticky:unfixed');
		};

		// Returns the constructor
		return Sticky;
	}
);
