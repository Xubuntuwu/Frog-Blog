const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = mongoose.model(
    'Post',
    new Schema({
        title: {type: String, required: true},
        content: {type: String, required: true},
        // created: {type: Date, required: true},
        public: {type: Boolean, required: true},
        owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    }, {timestamps: true})
)

module.exports = Post;