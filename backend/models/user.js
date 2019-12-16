const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name field is required.']
	},
	pwdHash: {
		type: String,
		required: [true, 'Password hash field is required.']
  },
  email: {
	  type: String,
	  required: [true, 'Email field is required.']
  },
  sigPubKey: {
	  type: String,
	  required: [true, 'Signature public key is required.']
  }
});

// Creating a table within database with the defined schema
const User = mongoose.model('User', UserSchema);

// Exporting table for querying and mutating
module.exports = User