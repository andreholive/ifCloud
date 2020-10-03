const mongoose = require('../database');

const LinkSchema = new mongoose.Schema({
    id: {type: String},
    labels: {type: Array},
    locked: {type: Boolean, default: false},
    points: {type: Array},
    selected: {type: Boolean, default: false},
    source: {type: String},
    status: {type: Number, default: 1},
    sourcePort: {type: String},
    target: {type: String},
    targetPort: {type: String},
    network_id: {type: String},
    cidr: {type: String},
    type: {type: String, default: "link"},
});

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;