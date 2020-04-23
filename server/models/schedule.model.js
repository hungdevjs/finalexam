const mongoose = require("mongoose");
const { subjects } = require("../utils/constant");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    classRoom: {
        type: String,
        required: true,
    },
    schedule: {
        mon: [{ type: String, _id: false, enum: subjects }],
        tue: [{ type: String, _id: false, enum: subjects }],
        wed: [{ type: String, _id: false, enum: subjects }],
        thu: [{ type: String, _id: false, enum: subjects }],
        fri: [{ type: String, _id: false, enum: subjects }],
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
