const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
        uid: {type: String},
        createdAt: {
            type: Date,
            default: Date.now,
        }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;