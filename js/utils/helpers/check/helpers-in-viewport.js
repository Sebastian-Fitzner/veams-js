/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// CHECK HELPERS
// ----------------------------------

/**
 * Check if element is in viewport
 *
 * @param {Object} el - Object, which we want to check
 * @param {boolean} useBounds - if true, whole element must be visible
 *
 * @return {boolean}
 */
Helpers.isInViewport = function (el, useBounds) {
	let el = el[0];
	let top = el.offsetTop;
	let left = el.offsetLeft;
	let width = el.offsetWidth;
	let height = el.offsetHeight;
	let cond = false;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	if (useBounds) {
		cond = top >= window.pageYOffset && left >= window.pageXOffset && (top + height) <= (window.pageYOffset + window.innerHeight) && (left + width) <= (window.pageXOffset + window.innerWidth);
	} else {
		cond = top < (window.pageYOffset + window.innerHeight) && left < (window.pageXOffset + window.innerWidth) && (top + height) > window.pageYOffset && (left + width) > window.pageXOffset;
	}

	return cond;
};

export default Helpers;