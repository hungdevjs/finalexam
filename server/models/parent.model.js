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
            medium: { type: Number, _id: false },
        },
        literature: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        english: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        physics: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        chemistry: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        biology: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        geography: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        history: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        law: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        music: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        art: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
        sport: {
            x1: [{ type: Number, _id: false, enum: validScore }],
            x2: [{ type: Number, _id: false, enum: validScore }],
            x3: [{ type: Number, _id: false, enum: validScore }],
            medium: { type: Number, _id: false },
        },
    },
    finalScore: {
        type: Number,
    },
    conduct: {
        type: String,
        enum: ["Tốt", "Khá", "Trung bình", "Yếu"],
    },
    result: {
        type: String,
        enum: ["Giỏi", "Tiên tiến", "Trung bình", "Yếu", ""],
    },
    dayOff: [
        {
            _id: false,
            day: { type: String },
            permission: Boolean,
        },
    ],
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
