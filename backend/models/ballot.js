const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BallotSchema = new Schema({
  address: {
	  type: String,
	  required: [true, 'Address of election is required.']
  },
	ballotId: {
		type: Number,
		required: [true, 'Ballot ID is required.']
  },
  choice: {
    type: Number,
    required: [true, 'Choice is required.']
  }
});

// Creating a table within database with the defined schema
const Ballot = mongoose.model('Ballot', BallotSchema);

// Exporting table for querying and mutating
module.exports = Ballot;