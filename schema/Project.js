const { Schema, model } = require('../lib/dbConnect');
const User = require('./User');

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  projectManager: {
    type: User,
    required: true,
  },
  document: {
    type: File,
  },
  developer: {
    type: User,
    required: true,
    trim: true,
  },
});

module.exports = model('Project', projectSchema);