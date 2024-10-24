const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const { sendErrorResponse, sendCreatedResponse, sendSuccessResponse, sendNotFoundResponse } = require('../utils/responseHelper');

// Create a new topic
const createTopic = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { title, description, content, attachments } = req.body;
        
        // Create a new topic with reference to the chapter
        const topic = new Topic({ title, description, content, attachments, chapter: chapterId });
        await topic.save();

        // Push topic ID into the related chapter's topics array
        await Chapter.findByIdAndUpdate(chapterId, { $push: { topics: topic._id } });

        return sendCreatedResponse(res, "Successfully created topic", topic);
    } catch (error) {
        return sendErrorResponse(res, "Error creating topic", error.message);
    }
};

// Get all topics for a chapter
const getTopics = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const topics = await Topic.find({ chapter: chapterId });

        return sendSuccessResponse(res, 'Successfully fetched topics', topics);
    } catch (error) {
        return sendErrorResponse(res, "Error fetching topics", error.message);
    }
};

// Update a topic
const updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!topic) {
            return sendNotFoundResponse(res, "Topic not found");
        }

        return sendSuccessResponse(res, 'Successfully updated topic', topic);
    } catch (error) {
        return sendErrorResponse(res, "Error updating topic", error.message);
    }
};

// Delete a topic
const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findByIdAndDelete(req.params.id);

        if (!topic) {
            return sendNotFoundResponse(res, 'Topic not found');
        }

        return sendSuccessResponse(res, "Successfully deleted topic", topic);
    } catch (error) {
        return sendErrorResponse(res, "Error deleting topic", error.message);
    }
};

module.exports = { createTopic, getTopics, updateTopic, deleteTopic };
