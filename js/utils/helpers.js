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
let Helpers = window.Veams = window.Veams || {};

/**
 * Required helper functions
 */
import './helpers/helpers-load-module';
import './helpers/functional/helpers-extend-methods';
import './helpers/functional/helpers-query-selector';

/**
 * Optional helper functions
 */
import './helpers/extend/helpers-mixin';
import './helpers/functional/helpers-throttle';

export default Helpers;
