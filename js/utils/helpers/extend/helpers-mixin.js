import './helpers-extend-methods';

/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// EXTEND HELPERS
// ----------------------------------

/**
 * Merge method functions.
 *
 * @param {Object} from - Mixin object which will be merged via Helpers.defaults with the methods of our class
 * @param {Array} methods - Array of method names which will be extended.
 */
Helpers.mixin = function (from, methods = ['initialize', 'render']) {

	let to = this.prototype;

	/** Add those methods which exists on `from` but not on `to` to the latter */
	Helpers.defaults(to, from);

	/** we do the same for events */
	if (to.events) {
		Helpers.defaults(to.events, from.events);
	}

	// Extend to's methods
	methods.forEach((method) => {
		Helpers.extendMethod(to, from, method);
	});
};

/**
 * Helper method to extend an already existing method.
 *
 * @param {Object} to - view which will be extended
 * @param {Object} from - methods which comes from mixin
 * @param {string} methodName - function name
 */
Helpers.extendMethod = function (to, from, methodName) {
	function isUndefined(value) {
		return typeof value == 'undefined';
	}

	// if the method is defined on from ...
	if (!isUndefined(from[methodName])) {
		let old = to[methodName];

		// ... we create a new function on to
		to[methodName] = function () {

			// wherein we first call the method which exists on `to`
			let oldReturn = old.apply(this, arguments);

			// and then call the method on `from`
			from[methodName].apply(this, arguments);

			// and then return the expected result,
			// i.e. what the method on `to` returns
			return oldReturn;
		};
	}
};

export default Helpers;