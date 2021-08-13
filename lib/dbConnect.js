const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/restapitaskDb", { useCreateIndex: true, useNewUrlParser: true , useUnifiedTopology: true})
  .catch(err => console.error(`MongoDB Connect error: ${err.message}`));

module.exports = mongoose;