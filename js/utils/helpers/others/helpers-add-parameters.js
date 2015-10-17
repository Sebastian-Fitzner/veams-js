/**
 * @alias module:Helper
 */
let Helpers = window.Veams = window.Veams || {};

// ----------------------------------
// OTHER HELPERS
// ----------------------------------

/**
 * Add/Update parameters for given url
 *
 * @param {url} url - URL on which parameters should be added / changed
 * @param {string} paramName - parameter name
 * @param {string} paramValue - parameter value
 *
 * @return {string} url
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
;

export default Helpers;