const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: false
        // change from true to false to allow users to login
        // with oAuth from 3rd party side as google, github, facebook, etc.
        // no password is required for oAuth login
    },
    authProvider: {
        type: String,
        enum: ['manual', 'google', 'github'],
        // local means user signs up manually
        default: 'manual'
    },
    roles: {
        // an account can have multiple roles
        type: [String],
        enum: ['admin', 'manager', 'user'],
        default: ['user']
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpiresAt: {
        type: Date
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
