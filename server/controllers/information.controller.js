const moment = require("moment")
const { subjects } = require("../utils/constant")
const checkConflictSchedule = require("../utils/checkConflictSchedule")
const validateDate = require("../utils/validateDate")

const Parent = require("../models/parent.model")
const Teacher = require("../models/teacher.model")
const Grade = require("../models/grade.model")
const Schedule = require("../models/schedule.model")
const Semester = require("../models/semester.model")
const Missing = require("../models/missing.model")
const Event = require("../models/event.model")
const Dayoff = require("../models/dayoff.model")

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
        const mainTeacher = teachers.find(
            (teacher) => teacher.mainTeacherOfClass === classRoom
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

module.exports.getAdminReport = async (req, res) => {
    try {
        const students = await Parent.countDocuments({ isDeleted: false })
        const teachers = await Teacher.countDocuments({ isDeleted: false })
        const grades = await Grade.find({ isDeleted: false })
        const studentOff = await Dayoff.find({
            isDeleted: false,
            day: moment().format("DD/MM/YYYY"),
        })

        const numberOfClasses = grades.reduce(
            (totalClass, grade) => totalClass + grade.classRoom.length,
            0
        )

        const data = {
            numberOfStudents: students,
            numberOfTeachers: teachers,
            numberOfClasses,
            studentOff,
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getAdminChart = async (req, res) => {
    try {
        const grade6 = await Parent.countDocuments({
            isDeleted: false,
            grade: 6,
        })
        const grade7 = await Parent.countDocuments({
            isDeleted: false,
            grade: 7,
        })
        const grade8 = await Parent.countDocuments({
            isDeleted: false,
            grade: 8,
        })
        const grade9 = await Parent.countDocuments({
            isDeleted: false,
            grade: 9,
        })

        const semester = await Semester.find()
        const columnChart = semester[0].lastResult

        const data = {
            pieChart: { grade6, grade7, grade8, grade9 },
            columnChart,
        }

        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getEvent = async (req, res) => {
    try {
        const events = await Event.find({ isDeleted: false })
        const data = events
            .filter((ev) => new Date(ev.time).getTime() > new Date().getTime())
            .sort(
                (ev1, ev2) =>
                    new Date(ev1.time).getTime() - new Date(ev2.time).getTime()
            )

        res.status(200).json(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.createOrUpdateEvent = async (req, res) => {
    try {
        const { id, time, content } = req.body

        if (id) {
            const event = await Event.findOne({ _id: id, isDeleted: false })

            if (!event) throw new Error("Event doesn't exist")

            if (!content || !content.trim()) throw new Error("Content is empty")

            event.content = content

            await event.save()

            return res.status(200).send("Update event successfully")
        }

        if (!validateDate(time)) throw new Error("Time is not valid")
        if (!content || !content.trim()) throw new Error("Content is empty")

        const data = {
            time,
            content,
            isDeleted: false,
        }

        const newEvent = new Event(data)

        await newEvent.save()

        res.status(201).send("Create event successfully")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params
        const event = await Event.findOne({ _id: id, isDeleted: false })

        if (!event) throw new Error("Event doesn't exist")

        event.isDeleted = true
        await event.save()

        res.status(200).send("Delete event successfully")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.markOff = async (req, res) => {
    try {
        const { id } = req
        const { studentId, permission, day } = req.body

        if (!validateDate(day)) throw new Error("Day is not valid")

        const teacher = await Teacher.findOne({ isDeleted: false, _id: id })
        if (!teacher) throw new Error("Teacher doesn't exist")

        const student = await Parent.findOne({
            isDeleted: false,
            _id: studentId,
        })
        if (!student) throw new Error("Student doesn't exist")

        if (teacher.mainTeacherOfClass !== student.classRoom)
            throw new Error(
                "Teacher doesn't have permission to mark off this student"
            )

        student.dayOff = [...student.dayOff, { day, permission }]

        await student.save()

        const data = {
            day: moment(new Date(day)).format("DD/MM/YYYY"),
            student: {
                id: student._id,
                name: student.studentName,
                classRoom: student.classRoom,
                permission,
            },
            isDeleted: false,
        }

        const newDayoff = new Dayoff(data)
        await newDayoff.save()

        res.status(200).send("Mark off successfully")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.teacherGetStudentOff = async (req, res) => {
    try {
        const { id } = req

        const teacher = await Teacher.findOne({ isDeleted: false, _id: id })
        if (!teacher) throw new Error("Teacher doesn't exist")

        if (
            !teacher.mainTeacherOfClass ||
            teacher.mainTeacherOfClass.length === 0
        )
            throw new Error("Teacher is not main teacher")

        const students = await Parent.find({
            isDeleted: false,
            classRoom: teacher.mainTeacherOfClass,
        })

        if (!students) throw new Error("Students doesn't exist")

        const studentOffToday = students.filter(
            (student) =>
                student.dayOff.filter(
                    (item) =>
                        moment(new Date(item.day)).format("DD/MM/YYYY") ===
                        moment().format("DD/MM/YYYY")
                ).length > 0
        )

        const studentOff = studentOffToday.map((student) => ({
            studentName: student.studentName,
            permission: student.dayOff.find(
                (item) =>
                    moment(new Date(item.day)).format("DD/MM/YYYY") ===
                    moment().format("DD/MM/YYYY")
            ).permission,
        }))

        res.status(200).json(studentOff)
    } catch (err) {
        res.status(500).send(err.message)
    }
}
