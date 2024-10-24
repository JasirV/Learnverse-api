// models/Topic.js
const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    attachments: [{ type: String }], 
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);
