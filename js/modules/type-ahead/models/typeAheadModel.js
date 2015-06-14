var $ = require('jquery');
var Exo = require('exoskeleton');


// Creates a new Backbone Model class object
var typeAheadModel = Exo.Model.extend({
	defaults: { // Define some types which can be used
		keyword: ''
	}
});

// Returns the Model class
module.exports = typeAheadModel;
