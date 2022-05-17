
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const URLSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    date: {
        type: Date,
        default: Date.now()
    }
})

// create a model from schema and export it
module.exports = mongoose.model('Url', URLSchema)