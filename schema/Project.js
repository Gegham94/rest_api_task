const mongoose = require("mongoose");
const { Schema, model } = require('../lib/dbConnect');

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
  },
  document: {
    type: Object,
  },
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    trim: true,
  },
});

module.exports = model('Project', projectSchema);