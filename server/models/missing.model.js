const mongoose = require("mongoose")
const Parent = require("./parent.model")

const Schema = mongoose.Schema

const missingSchema = new Schema({
    date: {
        type: String,
        required: true,
        unique: true,
    },
    students: [{ _id: false, studentId: String, classRoom: String }],
})

const Missing = mongoose.model("Missing", missingSchema)

module.exports = Missing
