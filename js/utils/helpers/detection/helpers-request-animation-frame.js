/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// DETECTION HELPERS
// ----------------------------------

/**
 * Request animation frame
 *
 * @return {function}
 */
Helpers.requestAniFrame = function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
};

export default Helpers;