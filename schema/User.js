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
    trim: true,
  },
  dateOfBirth: {
      type: Date,
      required: true,
  },
  image: {
    type: String,
    required: true,
    default: "default.jpg"
  },
});

module.exports = model('User', userSchema);