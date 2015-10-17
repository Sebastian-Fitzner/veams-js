/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// CHECK HELPERS
// ----------------------------------

/**
 * Check if element is in a specific context
 * and return state as boolean
 *
 * @param {Object} el - Element, which will be checked
 * @param {Object} context - Context element, in which our element could persists
 *
 * @return {boolean}
 */
Helpers.checkElementInContext = function (el, context) {
	var state = el.closest(context).length === 1;

	return state;
};

export default Helpers;