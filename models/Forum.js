const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    topics: [
        {
            title: String,
            content: String,
            comments: [
                {
                    comment: String,
                    replies: [String],
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Forum', forumSchema);
