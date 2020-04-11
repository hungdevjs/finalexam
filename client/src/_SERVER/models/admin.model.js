const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    refreshToken: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin