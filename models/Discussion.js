// models/Discussion.js
const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        replies: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            content: { type: String, required: true },
            likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Discussion', DiscussionSchema);
