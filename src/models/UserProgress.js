const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    isCompleted: { type: Boolean, default: false }, // Progress for the topic
}, {
    timestamps: true,
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
