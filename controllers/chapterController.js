const express = require('express');
const Chapters = require('../models/Chapter');
const Course = require('../models/Course');
const {
    sendSuccessResponse,
    sendCreatedResponse,
    sendNotFoundResponse,
    sendErrorResponse,
} = require('../utils/responseHelper');

// Create a new Chapter
const createChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description } = req.body;

        // Validate inputs
        if (!title || !description) {
            return sendErrorResponse(res, 'Title and description are required', 400);
        }

        const chapter = new Chapters({ title, description, course: courseId });
        await chapter.save();
        await Course.findByIdAndUpdate(courseId, { $push: { chapters: chapter._id } });

        return sendCreatedResponse(res, 'Chapter created successfully', chapter);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Get Chapters for a course
const getChaptersForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const chapters = await Chapters.find({ course: courseId }).populate('topics');

        if (!chapters.length) {
            return sendNotFoundResponse(res, 'No chapters found for this course');
        }

        return sendSuccessResponse(res, 'Successfully fetched chapters', chapters);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Update a chapter
const updateChapter = async (req, res) => {
    try {
        const chapter = await Chapters.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!chapter) {
            return sendNotFoundResponse(res, 'Chapter not found');
        }

        return sendSuccessResponse(res, 'Update successful', chapter);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Delete a chapter
const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapters.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return sendNotFoundResponse(res, 'Chapter not found');
        }

        return sendSuccessResponse(res, 'Successfully deleted the chapter', chapter);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

module.exports = {
    createChapter,
    getChaptersForCourse,
    updateChapter,
    deleteChapter,
};
