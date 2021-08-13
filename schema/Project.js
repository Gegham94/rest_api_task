const mongoose = require("mongoose");
const { Schema, model } = require('../lib/dbConnect');

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  document: {
    type: Object,
  },
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim: true,
  },
});

module.exports = model('Project', projectSchema);