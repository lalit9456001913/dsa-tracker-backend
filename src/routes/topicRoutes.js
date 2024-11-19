const express = require('express');
const { getTopics, updateProgress, getSubtopics, getProblems } = require('../controllers/topicController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getTopics);
router.get('/:topicId/subTopics', getSubtopics);
router.get('/:topicId/subTopics/:subTopicId/problems', getProblems);
router.put('/progress/:topicId', protect, updateProgress);

module.exports = router;