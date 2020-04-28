const jwt = require("jsonwebtoken")
const { subjects } = require("../utils/constant")
const checkConflictSchedule = require("../utils/checkConflictSchedule")

const Parent = require("../models/parent.model")
const Teacher = require("../models/teacher.model")
const Grade = require("../models/grade.model")
const Schedule = require("../models/schedule.model")
const Semester = require("../models/semester.model")

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

module.exports.getSemester = async (req, res) => {
    try {
        const now = await Semester.find()

        if (!now) {
            throw new Error("Get semester failed")
        }

        res.status(200).json({ year: now[0].year, semester: now[0].semester })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.createOrUpdateSchedule = async (req, res) => {
    try {
        const { classRoom, schedule } = req.body

        const schedules = await Schedule.find({ isDeleted: false })

        const classSchedule = schedules.find(
            (item) => item.classRoom === classRoom
        )

        const grades = await Grade.find({ isDeleted: false })

        if (!grades) {
            throw new Error("Doesn't have any grade")
        }

        let allClasses = []
        for (grade of grades) {
            allClasses = [...allClasses, ...grade.classRoom]
        }

        if (!allClasses.includes(classRoom)) {
            throw new Error("Class doesn't exist")
        }

        // check if class schedules have any conflicts
        const teachers = await Teacher.find({ isDeleted: false })
        const classTeachers = teachers.filter((teacher) =>
            teacher.teacherOfClass.includes(classRoom)
        )

        for (classTeacher of classTeachers) {
            const classRooms = classTeacher.teacherOfClass.filter(
                (room) => room !== classRoom
            )
            const { subject } = classTeacher

            for (room of classRooms) {
                const roomSchedule = schedules.find(
                    (item) => item.classRoom === room
                )

                if (
                    !checkConflictSchedule(
                        schedule,
                        roomSchedule.schedule,
                        subject
                    )
                ) {
                    throw new Error(
                        `New schedule is conflict in ${subject} with class ${room}`
                    )
                }
            }
        }

        if (!classSchedule) {
            newSchedule = new Schedule({
                classRoom,
                schedule,
                isDeleted: false,
            })
            await newSchedule.save()
        } else {
            classSchedule.schedule = schedule
            await classSchedule.save()
        }

        res.status(200).send(true)
    } catch (err) {
        res.status(200).send({ error: err.message })
    }
}
