const mongoose = require("mongoose")

const Schema = mongoose.Schema

const semesterSchema = new Schema({
    year: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
        enum: [1, 2],
    },
})

const Semester = mongoose.model("Semester", semesterSchema)

module.exports = Semester
