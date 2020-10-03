const mongoose = require('../database');

const ProjectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true
    },
    models:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model'
    }],
    links:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;