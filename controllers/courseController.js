const Course = require('../models/Course');
const {
    sendSuccessResponse,
    sendCreatedResponse,
    sendNotFoundResponse,
    sendErrorResponse,
} = require('../utils/responseHelper');

// Middleware to check if the user is the course author
const isAuthor = async (req, courseId) => {
    const course = await Course.findById(courseId);
    return course && course.author.toString() === req.user._id.toString();
};

// Create a new course (Only author can create)
const createCourse = async (req, res) => {
    const { title, description, category, chapters } = req.body;
    console.log(title,'titile',req.user)
    try {
        const course = new Course({
            title,
            description,
            category,
            chapters,
            author: req.user._id,
        });
        await course.save();
        return sendCreatedResponse(res, 'Course created successfully', course);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Get courses (Public access)
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

// Update a course (Only author can update)
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        if (!(await isAuthor(req, id))) {
            return sendErrorResponse(res, 'Unauthorized to update this course');
        }

        const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
        if (!course) {
            return sendNotFoundResponse(res, 'Course not found');
        }
        return sendSuccessResponse(res, 'Course updated successfully', course);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Delete a course (Only author can delete)
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        if (!(await isAuthor(req, id))) {
            return sendErrorResponse(res, 'Unauthorized to delete this course');
        }

        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return sendNotFoundResponse(res, 'Course not found');
        }
        return sendSuccessResponse(res, 'Course deleted successfully', course);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

const myCourse = async (req, res) => {
    try {
        const courses = await Course.find({ author: req.user._id }).populate('chapters');
        if (courses.length === 0) {
            return sendSuccessResponse(res, 'No courses found for this user', []);
        }

        return sendSuccessResponse(res, 'Successfully fetched user courses', courses);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

module.exports = {myCourse, createCourse, getCourses, updateCourse, deleteCourse };
