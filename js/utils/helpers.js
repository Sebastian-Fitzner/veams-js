/**
 * Represents a Helper Object.
 * @module Helper
 *
 * @author Sebastian Fitzner
 */

"use strict";

/**
 * @alias module:Helper
 */
var Helpers = {};

/**
 * Simple extend method to extend the properties of an object.
 *
 * @param {obj} obj - object which will be extended
 */
Helpers.extend = function extend(obj) {
	[].slice.call(arguments, 1).forEach((item) => {
		for (var key in item) obj[key] = item[key];
	});
	return obj;
};

/**
 * Simple extend method, which extends an object.
 *
 * @param {obj} obj - object which will be extended
 */
Helpers.defaults = function defaults(obj) {
	[].slice.call(arguments, 1).forEach((item) => {
		for (var key in item)
			if (obj[key] === undefined)
				obj[key] = item[key];
	});
	return obj;
};

/**
 * Find index of a specific item in an array.
 *
 * @param {array} array - array in which we search for
 * @param {obj} item - item which will be searched
 */
Helpers.indexOf = function(array, item) {
	if (array == null) return -1;
	var i, l;

	for (i = 0, l = array.length; i < l; i++)
		if (array[i] === item) return i;
	return -1;
};

/**
 * Merge views method functions.
 * @param {object} from - Mixin object which will be merged via Helpers.defaults with the methods of our view
 */
Helpers.viewMixin = function(from) {

	var to = this.prototype;

	/** Add those methods which exists on `from` but not on `to` to the latter */
	Helpers.defaults(to, from);

	/** we do the same for events */
	Helpers.defaults(to.events, from.events);

	/** Extend `to`'s `render` */
	Helpers.extendMethod(to, from, 'render');
	/** Extend `to`'s `initialize` */
	Helpers.extendMethod(to, from, 'initialize');
};

/**
 * Helper method to extend an already existing method.
 * @param {object} to - view which will be extended
 * @param {object} from - methods which comes from mixin
 * @param {string} methodName - function name
 */
Helpers.extendMethod = function(to, from, methodName) {
	function isUndefined(value) {
		return typeof value == 'undefined';
	}

	// if the method is defined on from ...
	if (!isUndefined(from[methodName])) {
		var old = to[methodName];

		// ... we create a new function on to
		to[methodName] = function() {

			// wherein we first call the method which exists on `to`
			var oldReturn = old.apply(this, arguments);

			// and then call the method on `from`
			from[methodName].apply(this, arguments);

			// and then return the expected result,
			// i.e. what the method on `to` returns
			return oldReturn;

		};
	}
};

/**
 * Detect transitionend event.
 */
Helpers.transitionEndEvent = function() {
	var t;
	var el = document.createElement('fakeelement');
	var transitions = {
		'transition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'MozTransition': 'transitionend',
		'WebkitTransition': 'webkitTransitionEnd'
	};

	for (t in transitions) {
		if (el.style[t] !== undefined) {
			return transitions[t];
		}
	}
};

/**
 * Detect animationend event.
 */
Helpers.animationEndEvent = function() {
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

/**
 * Touch Detection
 */
Helpers.isTouch = function() {
	return 'ontouchstart' in window;
};

/**
 * Determine click handler.
 */
Helpers.clickHandler = function() {
	return Helpers.isTouch() ? 'touchstart' : 'click';
};

/**
 * Simple forEach method
 *
 * @param {array} array - array of objects
 * @param {function} callback - callback function
 * @param {string} scope - scope of function
 */
Helpers.forEach = function(array, callback, scope) {
	for (var i = 0; i < array.length; i++) {
		callback.call(scope, i, array[i]);
	}
};

/**
 * Initialize a module and render it and/or provide a callback function
 *
 * @param {obj} obj - Definition of our module
 * @param {string} obj.el - Required: element
 * @param {obj} obj.Module - Required: class which will be used to render your module
 * @param {boolean} obj.render - Optional: render the class, if false the class will only be initialized
 * @param {function} obj.cb - Optional: provide a function which will be executed after initialisation
 * @param {obj} obj.context - Optional: context of module
 *
 */
Helpers.loadModule = function(obj) {
	if (!obj.el) throw new Error('In order to work with loadModule you need to define an element as string!');
	if (!obj.Module) throw new Error('In order to work with loadModule you need to define a Module!');

	let moduleList = Helpers.querySelectorArray({
		el: obj.el,
		context: obj.context
	});
	let renderOnInit = obj.render !== false;

	Helpers.forEach(moduleList, (i, el) => {
		let attrs = el.getAttribute('data-js-options');
		let options = JSON.parse(attrs);

		let module = new obj.Module({
			el: el,
			options: options
		});

		// Render after initial module loading
		if (renderOnInit) module.render();
		// Provide callback function in which you can use module and options
		if (obj.cb && typeof(obj.cb) === "function") obj.cb(module, options);
	});
};

/**
 * Get dom elements in an array
 *
 * @param {obj} obj - Selector and context
 * @param {obj.el} obj - Required: selector
 * @param {obj.context} obj - Optional: context
 *
 * @return array
 */
Helpers.querySelectorArray = function(obj) {
	if (!obj.el) throw new Error('In order to work with querySelectorAll you need to define an element as string!');
	
	let el = obj.el;
	let context = (obj.context) || document;

	return Array.prototype.slice.call((context).querySelectorAll(el));
};

/**
 * Check if script is already added,
 * and returns true or false
 *
 * @param {string} url - URL to your script
 */
Helpers.checkScript = function(url) {
	var x = document.getElementsByTagName("script");
	var scriptAdded = false;

	for (var i = 0; i < x.length; i++) {
		if (x[i].src == url) {
			scriptAdded = true;
		}
	}
	return scriptAdded;
};

/**
 * Load scripts asynchronous,
 * check if script is already added,
 * optional check if script is fully loaded and
 * execute callack function.
 *
 * @param {string} url - URL to your script
 * @param {fn} callbackFn - callback function
 * @param {this} callbackObj - this context
 */
Helpers.loadScript = function(url, callbackFn, callbackObj) {
	var scriptAdded = Helpers.checkScript(url);

	if (scriptAdded === false) {
		var script = document.createElement("script");
		script.src = url;
		document.body.appendChild(script);
	}

	if (callbackFn && typeof(callbackFn) === "function") {
		if (scriptAdded === true) {
			callbackFn.apply(callbackObj);
		} else {
			script.onreadystatechange = function() {
				if (x.readyState == 'complete') {
					callbackFn.apply(callbackObj);
				}
			};
			script.onload = function() {
				callbackFn.apply(callbackObj);
			};
		}
	}

	return false;
};

/**
 * Return new RegExp
 *
 * @param {string} regEx - Regular Expression
 */
Helpers.regExp = function(regEx) {
	return new RegExp("(^|\\s+)" + regEx + "(\\s+|$)");
};

if ('classList' in document.documentElement) {
	Helpers.hasClass = function(elem, c) {
		return elem.classList.contains(c);
	};
	Helpers.addClass = function(elem, c) {
		elem.classList.add(c);
	};
	Helpers.removeClass = function(elem, c) {
		elem.classList.remove(c);
	};
} else {
	Helpers.hasClass = function(elem, c) {
		return Helpers.regExp(c).test(elem.className);
	};
	Helpers.addClass = function(elem, c) {
		if (!Helpers.hasClass(elem, c)) {
			elem.className = elem.className + ' ' + c;
		}
	};
	Helpers.removeClass = function(elem, c) {
		elem.className = elem.className.replace(Helpers.regExp(c), ' ');
	};
}

/**
 * Add/Update paramters for given url
 * @param {url} url - URL on which parameters should be added / changed
 * @param {string} paramName - parameter name
 * @param {string} paramValue - parameter value
 */
Helpers.addParamToUrl = function(url, paramName, paramValue) {
	var urlParts = url.split('?');
	var i = 0;
	var baseUrl;
	var params;

	if (urlParts.length === 1) {
		return (url + '?' + paramName + '=' + paramValue);
	}

	baseUrl = urlParts[0];
	params = urlParts[1].split('&');

	for (i; i < params.length; i++) {
		if (params[i].indexOf(paramName + '=') > -1) {
			params[i] = paramName + '=' + paramValue;
			return (baseUrl + '?' + params.join('&'));
		}
	}

	return (baseUrl + '?' + params.join('&') + '&' + paramName + '=' + paramValue);
};


/**
 * based on https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
 */
Helpers.hasParent = function(e, p) {
	if (!e) return false;
	var el = e.target || e.srcElement || e || false;
	while (el && el != p) {
		el = el.parentNode || false;
	}
	return (el !== false);
};

/**
 * Check if element is in a specific context
 * and return state as boolean
 *
 * @param {obj} el - Element, which will be checked
 * @param {obj} context - Context element, in which our element could persists
 */
Helpers.checkElementInContext = function(el, context) {
	var state = el.closest(context).length === 1;

	return state;
};

/**
 * Check if node is really the same
 *
 * @param {obj} obj1 - Object, which we want to check
 * @param {obj} obj2 - Element, which we want to check against equality
 */
Helpers.checkNodeEquality = function(obj1, obj2) {
	return (obj1 === obj2);
};


/**
 * Check if element is in viewport
 *
 * @param {obj} el - Object, which we want to check
 * @param {boolean} useBounds - if true, whole element must be visible
 */
Helpers.isInViewport = function(el, useBounds) {
	var el = el[0];
	var top = el.offsetTop;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;
	var cond = false;

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

/**
 * Calculates the outer height for the given DOM element, including the
 * contributions of margin.
 *
 * @param el - the element of which to calculate the outer height
 * @param outer - add padding to height calculation
 */
Helpers.getOuterHeight = function(el, outer) {
	var height = el[0].offsetHeight;

	if (outer) {

		var style = getComputedStyle(el[0]);

		height += parseInt(style.paddingTop) + parseInt(style.paddingBottom);
	}
	return height;
};

export default Helpers;
