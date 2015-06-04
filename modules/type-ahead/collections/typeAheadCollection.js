// IndexCollection.js
var Exo = require('exoskeleton');
var Model = require('../models/typeAheadModel');

// Creates a new Backbone Collection class object
var typeAheadCollection = Exo.Collection.extend({

	// Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
	model: Model

});

// Returns the Model class
module.exports = typeAheadCollection;
