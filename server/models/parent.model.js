const mongoose = require("mongoose")

const Schema = mongoose.Schema

const parentSchema = new Schema({
    studentId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    studentName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
    },
    gender: {
        type: Boolean,
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    classRoom: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    note: {
        type: String,
    },
    father: {
        name: {
            type: String,
        },
        yearOfBirth: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        note: {
            type: String,
        },
    },
    mother: {
        name: {
            type: String,
        },
        yearOfBirth: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        note: {
            type: String,
        },
    },
    score: {
        math: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        literature: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        english: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        physics: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        chemistry: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        biology: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        geography: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        history: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        law: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        music: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        art: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
        sport: {
            x1: [{ type: Number, _id: false }],
            x2: [{ type: Number, _id: false }],
            x3: [{ type: Number, _id: false }],
        },
    },
    refreshToken: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
})

const Parent = mongoose.model("Parent", parentSchema)

module.exports = Parent
