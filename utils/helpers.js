/**
 * Represents a Helper Object.
 * @module Helper
 *
 * @author Sebastian Fitzner
 */
define('helpers', ['App', 'backbone'], function (App, Backbone) {

	"use strict";

	/**
	 * @alias module:Helper
	 */
	var Helpers = {};

	/**
	 * Merge views method functions.
	 * @param {object} from - Mixin object which will be merged via _.defaults with the methods of our view
	 */
	Helpers.viewMixin = function (from) {

		var to = this.prototype;

		/** Add those methods which exists on `from` but not on `to` to the latter */
		_.defaults(to, from);

		/** we do the same for events */
		_.defaults(to.events, from.events);

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
	Helpers.extendMethod = function (to, from, methodName) {

		// if the method is defined on from ...
		if (!_.isUndefined(from[methodName])) {
			var old = to[methodName];

			// ... we create a new function on to
			to[methodName] = function () {

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
	 * Add our Mixin to our Backbone.View object.
	 */
	Backbone.View.mixin = Helpers.viewMixin;

	/**
	 * Execute an action when orientation changed.
	 */
	Helpers.orientationChange = function () {
		switch (window.orientation) {
			case -90:
			case 90:
				App.Vent.trigger('rotate:landscape');
				location.reload();
				break;
			default:
				App.Vent.trigger('rotate:portrait');
				location.reload();
				break;
		}
	};

	/**
	 * Check if script is already added,
	 * and returns true or false
	 *
	 * @param {string} url - URL to your script
	 */
	Helpers.checkScript = function (url) {
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
	Helpers.loadScript = function (url, callbackFn, callbackObj) {
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
				script.onreadystatechange = function () {
					if (x.readyState == 'complete') {
						callbackFn.apply(callbackObj);
					}
				};
				script.onload = function () {
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
	Helpers.regExp = function (regEx) {
		return new RegExp("(^|\\s+)" + regEx + "(\\s+|$)");
	};

	if ('classList' in document.documentElement) {
		Helpers.hasClass = function (elem, c) {
			return elem.classList.contains(c);
		};
		Helpers.addClass = function (elem, c) {
			elem.classList.add(c);
		};
		Helpers.removeClass = function (elem, c) {
			elem.classList.remove(c);
		};
	} else {
		Helpers.hasClass = function (elem, c) {
			return Helpers.regExp(c).test(elem.className);
		};
		Helpers.addClass = function (elem, c) {
			if (!hasClass(elem, c)) {
				elem.className = elem.className + ' ' + c;
			}
		};
		Helpers.removeClass = function (elem, c) {
			elem.className = elem.className.replace(Helpers.regExp(c), ' ');
		};
	}

	/**
	 * Simplify class handling
	 */
	Helpers.classHandler = {
		has: Helpers.hasClass,
		add: Helpers.addClass,
		remove: Helpers.removeClass,
		toggle: Helpers.toggleClass
	};


	/**
	 * Add/Update paramters for given url
	 * @param {url} url - URL on which parameters should be added / changed
	 * @param {string} paramName - parameter name
	 * @param {string} paramValue - parameter value
	 */
	Helpers.addParamToUrl = function (url, paramName, paramValue) {
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
	Helpers.hasParent = function (e, p) {
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
	Helpers.checkElementInContext = function (el, context) {
		var state = el.closest(context).length === 1;

		return state;
	};

	/**
	 * Check if node is really the same
	 *
	 * @param {obj} obj1 - Object, which we want to check
	 * @param {obj} obj2 - Element, which we want to check against equality
	 */
	Helpers.checkNodeEquality = function (obj1, obj2) {
		return (obj1 === obj2);
	};

	return Helpers;
});
