const Discussion = require('../models/Discussion');
const { sendErrorResponse, sendSuccessResponse, sendNotFoundResponse, sendCreatedResponse } = require('../utils/responseHelper');

// Create a new discussion
const createDiscussion = async (req, res) => {
    try {
        const { course, title, content } = req.body;
        const discussion = new Discussion({ course, title, content });
        await discussion.save();
        return sendCreatedResponse(res, 'Successfully added discussion', discussion);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Get discussions for a course
const getDiscussion = async (req, res) => {
    try {
        const { courseId } = req.params;
        const discussions = await Discussion.find({ course: courseId }).populate('comments.user');
        return sendSuccessResponse(res, 'Successfully fetched discussions', discussions);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Comment on a discussion
const commentDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const { user, content } = req.body;
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) return sendNotFoundResponse(res, 'Discussion not found');

        discussion.comments.push({ user, content });
        await discussion.save();

        return sendCreatedResponse(res, 'Successfully added comment', discussion);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

// Reply to a comment
const replyComment = async (req, res) => {
    try {
        const { discussionId, commentId } = req.params;
        const { user, content } = req.body;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return sendNotFoundResponse(res, 'Discussion not found');

        const comment = discussion.comments.id(commentId);
        if (!comment) return sendNotFoundResponse(res, 'Comment not found');

        comment.replies.push({ user, content });
        await discussion.save();

        return sendCreatedResponse(res, 'Successfully added reply to comment');
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
};

module.exports = {
    createDiscussion,
    getDiscussion,
    commentDiscussion,
    replyComment,
};
