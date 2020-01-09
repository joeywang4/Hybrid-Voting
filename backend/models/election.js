const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ElectionSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Election title is required.']
	},
	description: {
		type: String,
		required: [true, 'Election description is required.']
  },
  choices: {
    type: [String],
    required: [true, 'Choices are required.']
  },
  voters: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	  required: [true, 'Voters are required.']
  },
  address: {
	  type: String,
	  required: [true, 'Address of election is required.']
  },
  ballots: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Ballot' }],
    required: [true, 'Ballots are required']
  }
});

// Creating a table within database with the defined schema
const Election = mongoose.model('Election', ElectionSchema);

// Exporting table for querying and mutating
module.exports = Election;