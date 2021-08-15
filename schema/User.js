const { Schema, model } = require('../lib/dbConnect');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  possition: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  // must put image data converted Base64 string
  image: {
    type: String,
    data: Buffer,
    contentType: String,
    default: "defailt.jpg",

  },
});

module.exports = model('User', userSchema);