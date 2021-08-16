const { Schema, model } = require('../lib/dbConnect');

const docSchema = new Schema({
    type: String,
    data: Buffer
});

module.exports = model('Document', docSchema);