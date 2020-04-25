const jwt = require("jsonwebtoken")
const { subjects } = require("../utils/constant")

const Parent = require("../models/parent.model")
const Teacher = require("../models/teacher.model")
const Grade = require("../models/grade.model")
const Schedule = require("../models/schedule.model")

module.exports.getAllClass = (req, res) => {
    try {
        Grade.find({ isDeleted: false })
            .then((grades) => {
                if (grades) {
                    let classes = []

                    for (let grade of grades) {
                        classes = [...classes, ...grade.classRoom]
                    }

                    return classes.sort()
                } else {
                    return []
                }
            })
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getAllSubject = (req, res) => {
    try {
        res.status(200).send(subjects.sort())
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getClassSchedule = async (req, res) => {
    try {
        const { classRoom } = req.params

        const schedule = await Schedule.findOne({ isDeleted: false, classRoom })

        if (!schedule) {
            throw new Error("No schedule to show")
        }

        res.status(200).json(schedule)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getStudentTranscript = async (req, res) => {
    try {
        const { studentId } = req.params
        const student = await Parent.findOne({
            isDeleted: false,
            _id: studentId,
        })

        if (!student) {
            throw new Error("Student doesn't exist")
        }

        const data = {
            name: student.studentName,
            score: student.score,
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getTeacherOfClass = async (req, res) => {
    try {
        const { classRoom } = req.params
        const teachers = await Teacher.find({ isDeleted: false })

        const subjectTeacher = teachers.filter((teacher) =>
            teacher.teacherOfClass.includes(classRoom)
        )
        const mainTeacher = teachers.find((teacher) =>
            teacher.mainTeacherOfClass.includes(classRoom)
        )

        res.status(200).json({ subjectTeacher, mainTeacher })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getTeacherSchedule = async (req, res) => {
    try {
        const { teacherId } = req.params

        const teacher = await Teacher.findOne({
            isDeleted: false,
            _id: teacherId,
        })

        if (!teacher) {
            throw new Error("Teacher doesn't exist")
        }

        const { teacherOfClass, subject, _id, name } = teacher
        const week = ["mon", "tue", "wed", "thu", "fri"]

        let teacherSchedule = {
            mon: new Array(5).fill(""),
            tue: new Array(5).fill(""),
            wed: new Array(5).fill(""),
            thu: new Array(5).fill(""),
            fri: new Array(5).fill(""),
        }

        for (const classRoom of teacherOfClass) {
            const room = await Schedule.findOne({
                isDeleted: false,
                classRoom,
            })

            week.map((item) => {
                if (room.schedule[item].includes(subject)) {
                    teacherSchedule[item] = room.schedule[item].map((sj) => {
                        if (sj === subject) {
                            return room.classRoom
                        }
                        return ""
                    })
                }
            })
        }

        const data = {
            _id,
            name,
            schedule: teacherSchedule,
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
