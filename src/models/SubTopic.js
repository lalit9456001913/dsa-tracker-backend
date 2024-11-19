const mongoose = require('mongoose');

const subTopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    order: {
        type: Number,
        required: true
    },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('SubTopic', subTopicSchema);
