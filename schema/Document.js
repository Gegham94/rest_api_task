const { Schema, model } = require('../lib/dbConnect');

const imageSchema = new Schema({
    type: String,
    data: Buffer
});

module.exports = model('Document', imageSchema);