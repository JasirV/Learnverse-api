// models/Chapter.js
const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({    
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }]
}, { timestamps: true });

module.exports = mongoose.model('Chapter', ChapterSchema);
