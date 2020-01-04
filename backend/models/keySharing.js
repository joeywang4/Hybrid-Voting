const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KeySharingSchema = new Schema({
  electionID: {
    type: Number,
		required: [true, 'election ID is required.']
  },
  tellers: {
    type: Array,
		required: [true, 'tellers are required.']
  },
  stage: {
    type: Number,
		required: [true, 'stage is required.']
  }
});

// Creating a table within database with the defined schema
const KeySharing = mongoose.model('KeySharing', KeySharingSchema);

// Exporting table for querying and mutating
module.exports = KeySharing;