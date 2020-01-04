const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ValidatorSchema = new Schema({
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
	validatorIndex: {
		type: Number,
		required: [true, 'Validator index is required.']
	},
  V: {
	  type: String,
	  required: [true, 'V is required.']
  }
});

// Creating a table within database with the defined schema
const Validator = mongoose.model('Validator', ValidatorSchema);

// Exporting table for querying and mutating
module.exports = Validator;