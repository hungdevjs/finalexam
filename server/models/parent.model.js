const mongoose = require("mongoose")

const Schema = mongoose.Schema

const validScore = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        literature: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        english: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        physics: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        chemistry: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        biology: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        geography: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        history: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        law: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        music: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        art: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
        },
        sport: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
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
