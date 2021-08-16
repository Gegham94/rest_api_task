const mongoose = require("mongoose");
const conf = require('../config/configuration.json');

mongoose
  .connect(conf.DB, { useCreateIndex: true, useNewUrlParser: true , useUnifiedTopology: true})
  .catch(err => console.error(`MongoDB Connect error: ${err.message}`));

module.exports = mongoose;