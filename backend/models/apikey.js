const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const APIKey = mongoose.model(
    'apikey',
    new Schema({
        type: {type: String, required: true},
        key: {type: String, required: true},
    }, {timestamps: true})
);

module.exports = APIKey;