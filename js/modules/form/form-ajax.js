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
			eventName: App.Events.formComplete
		};

		super(obj, options);
	}

	initialize() {
		// save some references
		this.fields = $('input', this.$el);
		this.selects = $('select', this.$el);

		// Fetch data if option is true
		if (this.options.submitOnLoad) this.fetchData(this.$el);

		// call super
		super.initialize();
	}

	/**
	 * Bind all evente
	 */
	bindEvents() {
		/**
		 * On submit event fetch data
		 */
		this.$el.on('submit reset', this.fetchData.bind(this));

		/**
		 * Reset filters on reset event
		 */
		App.Vent.on(App.Events.formReset, this.resetFilters.bind(this));

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
			});
			App.Vent.on(App.Events.selectChanged, (e) => {
				this.fetchData(e);
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
	 * Reset filters, currently supported
	 *
	 * checkboxes
	 * selects
	 */
	resetFilters() {
		this.resetChecks();
		this.resetSelects();
	}

	/**
	 * Reset checkboxes
	 */
	resetChecks() {
		this.fields.each(function () {
			$(this).removeAttr('checked');
		});
	}

	/**
	 * Resest selects
	 */
	resetSelects() {
		this.selects.each(function () {
			$(this).removeAttr('selected').find('option').eq(0).attr('selected', 'selected');
		});
	}
}

// Returns constructor
export default FormAjax;