const Topic = require('../models/Topic');
const UserProgress = require('../models/UserProgress');
const SubTopic = require('../models/SubTopic');
const Problem = require('../models/Problem');

const asyncHandler = require('express-async-handler');

exports.getTopics = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    try {
        const [topics, userProgresses] = await Promise.all([
            Topic.find().sort('order'),
            UserProgress.find({ userId }),
        ]);

        const progressMap = userProgresses.reduce((map, progress) => {
            map[progress.topicId.toString()] = progress.isCompleted;
            return map;
        }, {});

        const topicsWithProgress = topics.map((topic) => ({
            _id: topic._id,
            title: topic.title,
            description: topic.description,
            order: topic.order,
            isCompleted: progressMap[topic._id.toString()] || false,
        }));

        res.status(200).json({
            success: true,
            data: topicsWithProgress,
            message: "Fetched all topics successfully!",
        });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch topics. Please try again later.",
        });
    }
});

exports.getSubtopics = asyncHandler(async (req, res) => {
    const { topicId } = req.params;

    if (!topicId) {
        return res.status(400).json({ success: false, message: "Topic ID is required" });
    }

    try {
        const subtopics = await SubTopic.find({ topicId }).sort({ order: 1 });

        if (subtopics.length === 0) {
            return res.status(404).json({ success: false, message: "No subtopics found for the given topic ID" });
        }

        res.status(200).json({
            success: true,
            data: subtopics,
            message: "Fetched all subtopics successfully!",
        });
    } catch (error) {
        console.error("Error fetching subtopics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subtopics. Please try again later.",
        });
    }
});

exports.getProblems = asyncHandler(async (req, res) => {
    const { subTopicId, topicId } = req.params;

    if (!subTopicId || !topicId) {
        return res.status(400).json({ success: false, message: "SubTopic ID and Topic ID are required" });
    }

    try {
        const problems = await Problem.find({ subTopicId, topicId }).sort({ level: 1 });

        if (problems.length === 0) {
            return res.status(404).json({ success: false, message: "No problems found for the given SubTopic ID and Topic ID" });
        }

        res.status(200).json({
            success: true,
            data: problems,
            message: "Fetched all problems successfully!",
        });
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch problems. Please try again later.",
        });
    }
});

exports.updateProgress = asyncHandler(async (req, res) => {
    const { topicId } = req.params;
    const { isCompleted } = req.body;

    if (!topicId) {
        return res.status(400).json({
            success: false,
            message: "Topic ID is required",
        });
    }

    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access",
        });
    }

    try {
        const updatedProgress = await UserProgress.findOneAndUpdate(
            { userId, topicId },
            { isCompleted },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: updatedProgress,
            message: "Topic progress updated successfully!",
        });
    } catch (error) {
        console.error("Error updating progress:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update progress. Please try again later.",
        });
    }
});
