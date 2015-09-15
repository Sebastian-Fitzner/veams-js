/**
 * Represents a ajax form class.
 * @module ajaxForm
 *
 * @author Sebastian Fitzner
 */

import Helpers from '../../utils/helpers';
import App from '../../app';
import AppModule from '../_global/moduleView';

var $ = App.$;

class FormAjax extends AppModule {
	constructor(obj) {
		let options = {
			submitOnLoad: false,
			submitOnChange: true,
			showLoader: false, // loading class
			eventName: App.Events.formComplete,
			resetBtn: '[data-js-atom="form-reset"]'
		};

		super(obj, options);
	}

	initialize() {
		// save some references
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);
		this.resetBtn = this.$el.find(this.options.resetBtn);

		// Fetch data if option is true
		if (this.options.submitOnLoad) this.fetchData(this.$el);

		// hide reset button
		this.hideResetBtn();

		// call super
		super.initialize();
	}

	/**
	 * Bind all evente
	 */
	bindEvents() {

		/**
		 * Reset all filters by click on reset btn
		 *
		 * reset filters
		 * hide button
		 * fetch data
		 * trigger event for other modules
		 */
		this.resetBtn.on('click', () => {
			this.resetFilters();
			this.hideResetBtn();
			this.fetchData(this.$el);

			App.Vent.trigger(App.Events.formReset);
		});

		/**
		 * On submit event fetch data
		 */
		this.$el.on('submit reset', this.fetchData.bind(this));

		/**
		 * If submitOnChange is true
		 *
		 * fetch data
		 * show reset button
		 *
		 */
		if (this.options.submitOnChange) {
			this.$el.on('blur change', this.fields, (e) => {
				this.fetchData(e);
				this.showResetBtn();
			});
			App.Vent.on(App.Events.selectChanged, (e) => {
				this.fetchData(e);
				this.showResetBtn();
			});
		}
	}


	/**
	 * Ajax call to get data object with results or error message.
	 *
	 * @param {Object} e - object or event
	 */
	fetchData(e) {
		let el;

		if (e && e.preventDefault) {
			el = e.target;
			e.preventDefault();
		} else {
			el = e;
		}

		if (this.options.showLoader) this.$el.addClass(this.options.showLoader);

		let action = this.$el.attr('action');
		let method = this.$el.attr('method');
		let serialize = this.$el.serialize();
		let url = action + '?' + serialize;

		$.ajax({
			dataType: "json",
			url: url
		})
			.done((data) => {
				this.onSuccess(data, el);
			}).
			fail(this.onError.bind(this));
	}

	onSuccess(data, el) {
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);

		App.Vent.trigger(this.options.eventName, {
			data: data,
			el: el
		});

		if (this.options.showLoader) this.$el.removeClass(this.options.showLoader);
		this.$el.addClass('is-success');
	}

	onError() {
		console.log("error");
		if (this.options.showLoader) this.$el.removeClass(this.options.showLoader);
		this.$el.addClass('is-error');
	}

	/**
	 * Show reset button
	 */
	showResetBtn() {
		this.resetBtn.addClass('is-visible');
	}

	/**
	 * Hidereset button
	 */
	hideResetBtn() {
		this.resetBtn.removeClass('is-visible');
	}

	/**
	 * Reset filters, currently supported
	 *
	 * checkboxes
	 * selects
	 */
	resetFilters() {
		this.fields.each(function() {
			$(this).removeAttr('checked');
		});

		this.selects.each(function() {
			$(this).removeAttr('selected').find('option').eq(0).attr('selected', 'selected');
		});
	}
}

// Returns constructor
export default FormAjax;