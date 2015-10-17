/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// DETECTION HELPERS
// ----------------------------------

/**
 * Detect animationend event.
 */
Helpers.animationEndEvent = function () {
	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'animation': 'animationend',
		'OAnimation': 'oAnimationEnd',
		'MozAnimation': 'animationend',
		'WebkitAnimation': 'webkitAnimationEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
};

export default Helpers;