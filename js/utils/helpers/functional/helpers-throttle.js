/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// FUNCTIONAL HELPERS
// ----------------------------------

/**
 * Throttle method for resize events and more
 *
 * @param {function} func - Function which will be executed.
 * @param {number} wait - number to wait in milliseconds.
 * @param {boolean} immediate - execute function immediately.
 */

Helpers.throttle = function (func, wait, immediate) {
	var timeout;

	return function () {
		let context = this;
		let args = arguments;
		let callNow = immediate && !timeout;
		let later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
};

export default Helpers;