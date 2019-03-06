var mongoose = require('mongoose'),
    Comment = require('./comment')

var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created: {type: Date, default: Date.now}
});

module.exports =  mongoose.model("post", postSchema);