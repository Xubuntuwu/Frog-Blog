const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = mongoose.model(
    'Comment',
    new Schema({
        content: {type: String, required: true},
        // created: {type: Date, required: true},
        postid: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
        ownerid: {type: Schema.Types.ObjectId, ref: 'User', required: false},
        ownername: {type: String, required: false},
    }, {timestamps: true})
)

module.exports = Comment;