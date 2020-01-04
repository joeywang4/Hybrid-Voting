const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompositePointSchema = new Schema({
  electionID: {
    type: Number,
		required: [true, 'election ID is required.']
  },
	tellerID: {
		type: Number,
		required: [true, 'Teller ID is required.']
	},
	index: {
		type: Number,
		required: [true, 'Index is required.']
	},
  N: {
	  type: String,
	  required: [true, 'N is required.']
  }
});

// Creating a table within database with the defined schema
const CompositePoint = mongoose.model('CompositePoint', CompositePointSchema);

// Exporting table for querying and mutating
module.exports = CompositePoint;