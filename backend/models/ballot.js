const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BallotSchema = new Schema({
	ballotId: {
		type: Number,
		required: [true, 'Ballot ID is required.']
  },
  rawMsg: {
    type: String,
    required: [true, 'Decrypted message is required']
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