import '../functional/helpers-reg-expression';

/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// OTHER HELPERS
// ----------------------------------

Helpers.hasClass = function (elem, c) {
	if ('classList' in document.documentElement) {
		return elem.classList.contains(c);
	} else {
		return Helpers.regExp(c).test(elem.className);
	}
};

Helpers.addClass = function (elem, c) {
	if ('classList' in document.documentElement) {
		elem.classList.add(c);
	} else {
		if (!Helpers.hasClass(elem, c)) {
			elem.className = elem.className + ' ' + c;
		}
	}
};

Helpers.removeClass = function (elem, c) {
	if ('classList' in document.documentElement) {
		elem.classList.remove(c);
	}
	else {
		elem.className = elem.className.replace(Helpers.regExp(c), ' ');
	}
};

export default Helpers;