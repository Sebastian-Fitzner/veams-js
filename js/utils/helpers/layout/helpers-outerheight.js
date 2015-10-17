/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// LAYOUT HELPERS
// ----------------------------------

/**
 * Calculates the outer height for the given DOM element, including the
 * contributions of margin.
 *
 * @param {Object} el - the element of which to calculate the outer height
 * @param {boolean} outer - add padding to height calculation
 *
 * @return {number}
 */
Helpers.getOuterHeight = function (el, outer) {
	let height = el[0].offsetHeight;

	if (outer) {
		let style = getComputedStyle(el[0]);
		height += parseInt(style.paddingTop) + parseInt(style.paddingBottom);
	}
	return height;
};

export default Helpers;