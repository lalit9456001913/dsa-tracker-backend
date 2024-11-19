const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    subTopicId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubTopicSchema', required: true },
    leetcodeLink: { type: String, default: '' },
    codeforcesLink: { type: String, default: '' },
    youtubeLink: { type: String, default: '' },
    articleLink: { type: String, default: '' },
    level: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
});

module.exports = mongoose.model('Problem', problemSchema);

