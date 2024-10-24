// models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    duration: { type: String },
    category: { type: String },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
