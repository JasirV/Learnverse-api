const Course = require('../models/Course');
const {
    sendSuccessResponse,
    sendCreatedResponse,
    sendNotFoundResponse,
    sendErrorResponse,
} = require('../utils/responseHelper');

// Create a new course
const createCourse = async (req, res) => {
    const { title, description, category, chapters } = req.body;
    try {
        const course = new Course({ title, description, category, chapters });
        await course.save();
        return sendCreatedResponse(res, 'Course created successfully', course);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Get courses
const getCourses = async (req, res) => {
    try {
        const { id } = req.query;
        let courses = [];

        if (!id) {
            courses = await Course.find().populate('chapters');
            return sendSuccessResponse(res, 'Successfully fetched courses', courses);
        } else {
            const course = await Course.findById(id).populate('chapters');
            if (!course) {
                return sendNotFoundResponse(res, 'Course not found');
            }
            return sendSuccessResponse(res, 'Successfully fetched course', course);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Update a course
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            return sendNotFoundResponse(res, 'Course not found');
        }
        return sendSuccessResponse(res, 'Course updated successfully', course);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Delete a course
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return sendNotFoundResponse(res, 'Course not found');
        }
        return sendSuccessResponse(res, 'Course deleted successfully', course);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };
