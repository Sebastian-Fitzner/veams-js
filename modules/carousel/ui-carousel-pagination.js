/**
 * A module representing a carousel pagination.
 * @module Pagination
 *
 * @author Sebastian Fitzner
 */

define(['jquery', 'backbone'],

	function($, Backbone) {

		/**
		 * @alias module:Pagination
		 */
		var Pagination = Backbone.View.extend({

			/** Standard options of our pagination. */
			options: {
				activeClass: 'is-active',
				carouselRef: 'data-js-ref',
				slides: '[data-js-atom="carousel-list"]',
				pagination: '[data-js-atom="pagination-list"]',
				paginationElements: '[data-js-atom="pagination-list-item"]'
			},

			/**
			 * Initialize our view and merge our options from `data-js-options`.
			 * This method saves some important elements in `this`.
			 *
			 * @param {object} options - Passed object with options
			 */
			initialize: function(options) {
				this.options = _.defaults(options || {}, this.options); // get/set default options
				this.pager = this.$el;
				this.pagination = this.$el.find(this.options.pagination);
				this.carousel = $(this.$el.attr(this.options.carouselRef));
				this.index = 0;

				if (!this.carousel.length) {
					return;
				}
			},

			/**
			 * Initialize pagination.
			 * - Clone a pagination element for each slide
			 * - execute `_bindEventHandler()`
			 * - execute `_setWidth()`
			 */
			_initPagination: function() {
				var that = this;
				var paginationElements = this.$el.find(this.options.paginationElements);
				var i = 1;
				var length = this.getCarouselLength();

				for (i; i < length; ++i) {
					that.pagination.append(paginationElements.clone());
				}

				paginationElements.addClass(this.options.activeClass);
				this.paginationElements = this.$el.find(this.options.paginationElements);

				this._bindEventHandlers();
				this._setWidth();

			},

			/**
			 * Return the length of our carousel.
			 */
			getCarouselLength: function() {
				return this.carousel.find(this.options.slides).children().length;
			},

			/**
			 * Collect our events.
			 * - Listen to the carousel event `changeSlide` and execute `setActive()` with the right index
			 * - By clicking a pagination element, trigger `changeSlide` with `slideIndex` and `direction`
			 */
			_bindEventHandlers: function() {
				var that = this;

				this.carousel.on('CarouselView:changeSlide', function(e, i) {
					that.setActive(i);
				});

				this.paginationElements.on('click', function(e) {
					if ($(e.currentTarget).hasClass(that.options.activeClass)) {
						return;
					}
					that.$el.trigger('CarouselPagerView:changeSlide', {
						slideIndex: $(e.currentTarget).index() + 1, // Set the option slideIndex
						direction: that.getDirection($(e.currentTarget).index() + 1)
					});
				});
			},

			/**
			 * Set the width of our pagination.
			 */
			_setWidth: function() {
				var paginationWidth = 0,
					paginationMargin = parseInt(this.paginationElements.eq(0).css('margin-left'), 10) * 2;

				this.paginationElements.each(function() {
					paginationWidth += $(this).outerWidth() + paginationMargin;
				});

				this.pagination.css('width', paginationWidth);
				this.pagination.parent().css('width', '100%');
			},

			/**
			 * Set/Unset the active status of our pagination element.
			 *
			 * @param {number} i - Index of the pagination element.
			 */
			setActive: function(i) {
				if (i === this.index) {
					return;
				}

				this.paginationElements.removeClass(this.options.activeClass);
				$(this.paginationElements[i]).addClass(this.options.activeClass);
				this.index = i;
			},

			/**
			 * Return the direction `next` or `prev`.
			 *
			 * @param {number} newIndex - Index of the pagination element.
			 */
			getDirection: function(newIndex) {
				return newIndex > this.index ? "next" : "prev";
			},

			/**
			 * Render our pagination view.
			 */
			render: function() {
				this._initPagination();

				// Maintains chainability
				return this;

			}

		});

		// Returns the View class
		return Pagination;

	}
);
