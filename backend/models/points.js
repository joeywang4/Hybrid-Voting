const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PointSchema = new Schema({
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
	x: {
		type: Number,
		required: [true, 'x is required.']
	},
	f: {
		type: String,
		required: [true, 'f polynomial is required.']
  },
  g: {
	  type: String,
	  required: [true, 'g polynomial is required.']
  },
  h: {
	  type: String,
	  required: [true, 'h polynomial is required.']
  }
});

// Creating a table within database with the defined schema
const Point = mongoose.model('Point', PointSchema);

// Exporting table for querying and mutating
module.exports = Point