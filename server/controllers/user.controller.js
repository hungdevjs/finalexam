const shortid = require("shortid")
const _ = require("lodash")
const passwordHash = require("password-hash")

const validateDate = require("../utils/validateDate")
const sendSms = require("../utils/sendSms")
const {
    pageSize,
    createStudentText,
    createTeacherText,
    smsToMainTeacherText,
    subjects,
} = require("../utils/constant")

const Parent = require("../models/parent.model")
const Teacher = require("../models/teacher.model")
const Grade = require("../models/grade.model")
const Admin = require("../models/admin.model")

module.exports.getAllUser = (req, res) => {
    try {
        const {
            role,
            searchString,
            filterClass,
            filterGrade,
            filterSubject,
            currentPage,
        } = req.query

        if (role === "student") {
            const filter = filterClass
                ? { isDeleted: false, classRoom: filterClass }
                : { isDeleted: false }
            Parent.find(filter)
                .then((students) => {
                    if (students) {
                        let totalPage = 1
                        let data = [...students].sort((student1, student2) => {
                            return student1.studentName.toLowerCase() <
                                student2.studentName.toLowerCase()
                                ? -1
                                : 1
                        })

                        if (searchString) {
                            data = data.filter((student) =>
                                student.studentName
                                    .toUpperCase()
                                    .includes(searchString.toUpperCase())
                            )
                        }

                        if (filterGrade) {
                            data = data.filter(
                                (student) =>
                                    student.grade === parseInt(filterGrade)
                            )
                        }

                        const totalUser = data.length

                        if (currentPage > 0) {
                            totalPage = Math.ceil(data.length / pageSize) || 1
                            data = data.slice(
                                (currentPage - 1) * pageSize,
                                currentPage * pageSize
                            )
                        }

                        res.status(200).json({
                            data: data.map((student) => ({
                                id: student._id,
                                classRoom: student.classRoom,
                                grade: student.grade,
                                gender: student.gender,
                                studentName: student.studentName,
                                father: student.father,
                                mother: student.mother,
                                note: student.note,
                                address: student.address,
                                dateOfBirth: student.dateOfBirth,
                            })),
                            totalPage,
                            totalUser,
                        })
                    } else {
                        res.status(200).json([])
                    }
                })
                .catch((err) => {
                    res.status(500).send(err.message)
                })
        } else if (role === "teacher") {
            Teacher.find({ isDeleted: false })
                .then((teachers) => {
                    if (teachers) {
                        let totalPage = 1
                        let data = [...teachers].sort((teacher1, teacher2) => {
                            return teacher1.name.toLowerCase() <
                                teacher2.name.toLowerCase()
                                ? -1
                                : 1
                        })

                        if (searchString) {
                            data = data.filter((teacher) =>
                                teacher.name
                                    .toUpperCase()
                                    .includes(searchString.toUpperCase())
                            )
                        }

                        if (filterClass) {
                            data = data.filter(
                                (teacher) =>
                                    teacher.teacherOfClass.includes(
                                        filterClass
                                    ) ||
                                    teacher.mainTeacherOfClass === filterClass
                            )
                        }

                        if (filterSubject) {
                            data = data.filter(
                                (teacher) => teacher.subject === filterSubject
                            )
                        }

                        const totalUser = data.length

                        if (currentPage > 0) {
                            totalPage = Math.ceil(data.length / pageSize)
                            data = data.slice(
                                (currentPage - 1) * pageSize,
                                currentPage * pageSize
                            )
                        }

                        res.status(200).json({
                            data: data.map((teacher) => ({
                                id: teacher._id,
                                name: teacher.name,
                                email: teacher.email,
                                yearOfBirth: teacher.yearOfBirth,
                                gender: teacher.gender,
                                phoneNumber: teacher.phoneNumber,
                                mainTeacherOfClass: teacher.mainTeacherOfClass,
                                teacherOfClass: teacher.teacherOfClass,
                                subject: teacher.subject,
                            })),
                            totalPage,
                            totalUser,
                        })
                    } else {
                        res.status(200).json([])
                    }
                })
                .catch((err) => {
                    res.status(500).send(err.message)
                })
        } else {
            res.status(400).send("Bad request")
        }
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.deleteUser = (req, res) => {
    try {
        const { role, id } = req.params

        switch (role) {
            case "student":
                return Parent.findOne({ _id: id, isDeleted: false })
                    .then(async (student) => {
                        if (student) {
                            student.isDeleted = true
                            await student.save()
                            res.status(200).json("Xóa học sinh thành công")
                        } else {
                            res.status(400).json("Bad request")
                        }
                    })
                    .catch((err) => {
                        res.status(500).json(err.message)
                    })

            case "teacher":
                return Teacher.findOne({ _id: id, isDeleted: false })
                    .then(async (teacher) => {
                        if (teacher) {
                            teacher.isDeleted = true
                            await teacher.save()
                            res.status(200).json("Xóa giáo viên thành công")
                        } else {
                            res.status(400).json("Bad request")
                        }
                    })
                    .catch((err) => {
                        res.status(500).json(err.message)
                    })
            default:
                return res.status(400).json("Bad request")
        }
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.createStudent = (req, res) => {
    try {
        const data = req.body
        const { grade, classRoom, dateOfBirth } = data

        Grade.findOne({ isDeleted: false, grade })
            .then((gr) => {
                if (!validateDate(dateOfBirth))
                    throw new Error("Ngày sinh không hợp lệ")

                if (!gr) throw new Error("Khối học không tồn tại")

                if (gr && !gr.classRoom.includes(classRoom))
                    throw new Error("Lớp học không tồn tại")

                data.studentId = shortid.generate()

                let password = ""
                if (process.env.ENVIRONMENT === "DEVELOPMENT") {
                    password = "12345678"
                } else {
                    password = shortid.generate()
                }

                data.password = passwordHash.generate(password)

                data.score = {
                    math: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    literature: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    english: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    physics: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    chemistry: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    biology: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    geography: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    history: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    law: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    music: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    art: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                    sport: {
                        x1: [-1, -1, -1],
                        x2: [-1, -1],
                        x3: [-1],
                    },
                }
                data.isDeleted = false

                const newStudent = new Parent(data)

                newStudent
                    .save()
                    .then(() => {
                        // send sms with studentId and password to parent
                        const body = createStudentText
                            .replace("$studentName$", data.studentName)
                            .replace("$studentId$", data.studentId)
                            .replace("$password$", password)

                        const to =
                            process.env.ENVIRONMENT === "DEVELOPMENT"
                                ? "+84335210659"
                                : (
                                      data.father.phoneNumber ||
                                      data.mother.phoneNumber
                                  ).replace("0", "+84")

                        sendSms(to, body)

                        res.status(201).json(data)
                    })
                    .catch((err) => res.status(400).send(err.message))
            })
            .catch((err) => {
                res.status(400).send(err.message)
            })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getStudent = (req, res) => {
    try {
        const id = req.params.id

        Parent.findOne({ _id: id, isDeleted: false })
            .then((student) => {
                if (student) {
                    const {
                        _id,
                        studentName,
                        gender,
                        grade,
                        classRoom,
                        dateOfBirth,
                        address,
                        note,
                        studentId,
                        father,
                        mother,
                    } = student
                    const data = {
                        _id,
                        studentName,
                        gender,
                        grade,
                        classRoom,
                        dateOfBirth,
                        address,
                        note,
                        studentId,
                        father,
                        mother,
                    }

                    res.status(200).json(data)
                } else {
                    res.status(200).json("Học sinh không tồn tại")
                }
            })
            .catch((err) => {
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.updateStudent = (req, res) => {
    try {
        const id = req.params.id

        Parent.findOne({ _id: id, isDeleted: false })
            .then((student) => {
                if (student) {
                    const data = req.body
                    const {
                        studentName,
                        gender,
                        grade,
                        classRoom,
                        dateOfBirth,
                        address,
                        note,
                        father,
                        mother,
                    } = data

                    const updateArr = [
                        { field: "studentName", value: studentName },
                        { field: "gender", value: gender },
                        { field: "grade", value: grade },
                        { field: "classRoom", value: classRoom },
                        { field: "dateOfBirth", value: dateOfBirth },
                        { field: "address", value: address },
                        { field: "note", value: note },
                        { field: "father", value: father },
                        { field: "mother", value: mother },
                    ]

                    Grade.findOne({ isDeleted: false, grade })
                        .then(async (gr) => {
                            if (!validateDate(dateOfBirth))
                                throw new Error("Ngày sinh không hợp lệ")

                            if (!gr) throw new Error("Khối học không tồn tại")

                            if (gr && !gr.classRoom.includes(classRoom))
                                throw new Error("Lớp học không tồn tại")

                            updateArr.forEach((item) => {
                                student[item.field] = item.value
                            })

                            await student.save()
                            res.status(200).send("Cập nhật học sinh thành công")
                        })
                        .catch((err) => {
                            res.status(400).send(err.message)
                        })
                } else {
                    res.status(400).send("Học sinh không tồn tại")
                }
            })
            .catch((err) => {
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.getTeacher = (req, res) => {
    try {
        const id = req.params.id

        Teacher.findOne({ _id: id, isDeleted: false })
            .then((teacher) => {
                if (teacher) {
                    const {
                        _id,
                        name,
                        gender,
                        email,
                        yearOfBirth,
                        phoneNumber,
                        mainTeacherOfClass,
                        teacherOfClass,
                        subject,
                    } = teacher
                    const data = {
                        _id,
                        name,
                        gender,
                        email,
                        yearOfBirth,
                        phoneNumber,
                        mainTeacherOfClass,
                        teacherOfClass,
                        subject,
                    }

                    res.status(200).json(data)
                } else {
                    res.status(200).json("Giáo viên không tồn tại")
                }
            })
            .catch((err) => {
                res.status(500).send(err.message)
            })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.createTeacher = async (req, res) => {
    try {
        const data = req.body
        const {
            name,
            yearOfBirth,
            gender,
            email,
            phoneNumber,
            mainTeacherOfClass,
            subject,
            teacherOfClass,
        } = data

        // check if teacher email exist
        const teacher = await Teacher.findOne({ email, isDeleted: false })
        if (teacher) {
            throw new Error("Email đã được sử dụng")
        }

        // check if mainClass exist
        if (mainTeacherOfClass && mainTeacherOfClass.trim()) {
            let classes = []
            const grades = await Grade.find()
            if (grades) {
                for (const item of grades) {
                    classes = [...classes, ...item.classRoom]
                }
            }

            if (!classes.includes(mainTeacherOfClass)) {
                throw new Error("Lớp học không tồn tại")
            }

            const mainClass = await Teacher.find({
                isDeleted: false,
            }).distinct("mainTeacherOfClass")

            console.log(mainClass)

            const invalidMainclass = mainClass
                .filter((room) => room !== "")
                .includes(mainTeacherOfClass)

            if (invalidMainclass) {
                throw new Error(
                    `Lớp ${mainTeacherOfClass} đã có giáo viên chủ nhiệm`
                )
            }
        }

        // check if subject is valid
        if (!subjects.includes(subject)) {
            throw new Error(`Môn học không hợp lệ`)
        }

        // check if subject-teacherClass exist
        const classSameSubject = await Teacher.find({
            subject,
            isDeleted: false,
        }).distinct("teacherOfClass")

        const invalidSubjectClass = teacherOfClass.filter((item) =>
            classSameSubject.includes(item)
        )

        if (invalidSubjectClass.length > 0) {
            throw new Error(
                `Lớp ${invalidSubjectClass.join(
                    ", "
                )} đã có giáo viên môn ${subject}`
            )
        }

        data.isDeleted = false

        let password = ""
        if (process.env.ENVIRONMENT === "DEVELOPMENT") {
            password = "12345678"
        } else {
            password = shortid.generate()
        }

        data.password = passwordHash.generate(password)

        const newTeacher = new Teacher(data)
        await newTeacher.save()

        // send sms with email and password for teacher
        const body = createTeacherText
            .replace("$teacherName$", data.name)
            .replace("$teacherEmail$", data.email)
            .replace("$password$", password)

        const to =
            process.env.ENVIRONMENT === "DEVELOPMENT"
                ? "+84335210659"
                : data.phoneNumber.replace("0", "+84")

        sendSms(to, body)

        res.status(201).json(data)
    } catch (err) {
        res.json({ error: err.message })
    }
}

module.exports.updateTeacher = async (req, res) => {
    try {
        const id = req.params.id

        const currentTeacher = await Teacher.findOne({
            _id: id,
            isDeleted: false,
        })

        if (!currentTeacher) {
            throw new Error("Giáo viên không tồn tại")
        }

        const data = req.body
        const {
            name,
            yearOfBirth,
            gender,
            email,
            phoneNumber,
            mainTeacherOfClass,
            subject,
            teacherOfClass,
        } = data

        // check if mainClass exist
        const teachers = await Teacher.find({ isDeleted: false })
        const teacherSameMainClass = teachers.filter((teacher) => {
            return (
                teacher.id !== id &&
                teacher.mainTeacherOfClass !== "" &&
                teacher.mainTeacherOfClass === mainTeacherOfClass
            )
        })

        if (teacherSameMainClass.length > 0) {
            throw new Error(
                `Chung lớp chủ nhiệm với giáo viên ${teacherSameMainClass
                    .map((tc) => tc.name)
                    .join(", ")}`
            )
        }

        // check if subject is valid
        if (!subjects.includes(subject)) {
            throw new Error(`Môn học không hợp lệ`)
        }

        // check subject-class exist

        const teacherSameSubjectClass = teachers.filter(
            (tc) =>
                tc.id !== id &&
                tc.subject === subject &&
                tc.teacherOfClass.filter((room) =>
                    teacherOfClass.includes(room)
                ).length > 0
        )

        if (teacherSameSubjectClass.length > 0) {
            throw new Error(
                `Chung lớp chủ nhiệm với giáo viên ${teacherSameSubjectClass
                    .map((tc) => tc.name)
                    .join(", ")}`
            )
        }

        // update teacher
        const updateArr = [
            { field: "name", value: name },
            { field: "yearOfBirth", value: yearOfBirth },
            { field: "gender", value: gender },
            { field: "email", value: email },
            { field: "phoneNumber", value: phoneNumber },
            { field: "mainTeacherOfClass", value: mainTeacherOfClass },
            { field: "subject", value: subject },
            { field: "teacherOfClass", value: teacherOfClass },
        ]

        updateArr.forEach((item) => {
            currentTeacher[item.field] = item.value
        })

        await currentTeacher.save()
        res.status(200).send("Cập nhật giáo viên thành công")
    } catch (err) {
        res.json({ error: err.message })
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const expectedRole = req.params.role
        const expectedId = req.params.id

        const { role, id } = req

        if (role !== expectedRole || id !== expectedId) {
            throw new Error("Từ chối quyền truy cập")
        }

        const data = req.body

        switch (role) {
            case "parent":
                const student = await Parent.findOne({
                    _id: id,
                    isDeleted: false,
                })
                if (!student) {
                    throw new Error("Học sinh không tồn tại")
                }

                const {
                    studentName,
                    gender,
                    dateOfBirth,
                    address,
                    note,
                    father,
                    mother,
                } = data

                if (!validateDate(dateOfBirth)) {
                    throw new Error("Ngày sinh không hợp lệ")
                }

                const updateArrStudent = [
                    { field: "studentName", value: studentName },
                    { field: "gender", value: gender },
                    { field: "dateOfBirth", value: dateOfBirth },
                    { field: "address", value: address },
                    { field: "note", value: note },
                    { field: "father", value: father },
                    { field: "mother", value: mother },
                ]

                updateArrStudent.forEach((item) => {
                    student[item.field] = item.value
                })

                await student.save()
                res.status(200).send("Cập nhật thành công")

                break

            case "teacher":
                const teacher = await Teacher.findOne({
                    _id: id,
                    isDeleted: false,
                })
                if (!teacher) {
                    throw new Error("Giáo viên không tồn tại")
                }

                const { name, yearOfBirth, email, phoneNumber } = data
                const genderTeacher = data.gender

                const updateArrTeacher = [
                    { field: "name", value: name },
                    { field: "yearOfBirth", value: yearOfBirth },
                    { field: "gender", value: genderTeacher },
                    { field: "email", value: email },
                    { field: "phoneNumber", value: phoneNumber },
                ]

                updateArrTeacher.forEach((item) => {
                    teacher[item.field] = item.value
                })

                await teacher.save()
                res.status(200).send("Cập nhật thành công")

                break

            default:
                throw new Error("Bad request")
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.teacherGetAllStudent = async (req, res) => {
    try {
        const { searchString, filterClass, currentPage } = req.query
        const { id } = req

        let totalPage = 1
        const teacher = await Teacher.findOne({ _id: id, isDeleted: false })
        if (!teacher) {
            throw new Error("Giáo viên không tồn tại")
        }

        const classRooms = [
            ...new Set([teacher.mainTeacherOfClass, ...teacher.teacherOfClass]),
        ]

        const students = (await Parent.find({ isDeleted: false })) || []
        let data = students
            .filter((student) => classRooms.includes(student.classRoom))
            .sort((student1, student2) => {
                return student1.studentName.toLowerCase() <
                    student2.studentName.toLowerCase()
                    ? -1
                    : 1
            })
        const totalUser = data.length

        if (searchString) {
            data = data.filter((student) =>
                student.studentName
                    .toUpperCase()
                    .includes(searchString.toUpperCase())
            )
        }

        if (filterClass) {
            data = data.filter((student) => student.classRoom === filterClass)
        }

        if (currentPage > 0) {
            totalPage = Math.ceil(data.length / pageSize) || 1
            data = data.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
            )
        }

        res.status(200).json({
            data: data.map((student) => ({
                id: student._id,
                classRoom: student.classRoom,
                grade: student.grade,
                gender: student.gender,
                studentName: student.studentName,
                father: student.father,
                mother: student.mother,
                note: student.note,
                address: student.address,
                dateOfBirth: student.dateOfBirth,
                dayOff: student.dayOff,
            })),
            totalPage,
            totalUser,
        })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.updateTranscript = async (req, res) => {
    try {
        const { id } = req
        const { studentId, subject } = req.body

        const teacher = await Teacher.findOne({ _id: id, isDeleted: false })
        if (!teacher) {
            throw new Error("Giáo viên không tồn tại")
        }

        const student = await Parent.findOne({
            _id: studentId,
            isDeleted: false,
        })
        if (!student) {
            throw new Error("Học sinh không tồn tại")
        }

        if (!teacher.teacherOfClass.includes(student.classRoom)) {
            throw new Error("Giáo viên không phải là giáo viên chủ nhiệm")
        }

        if (teacher.subject !== subject.subject) {
            throw new Error("Giáo viên không có quyền sửa điểm môn học khác")
        }

        student.score[subject.name] = subject.score
        await student.save()

        res.status(200).send("Cập nhật bảng điểm thành công")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.sendMessageToMainTeacher = async (req, res) => {
    try {
        const { studentId, content, type } = req.body
        if (!["sms", "email"].includes(type))
            throw new Error("Tùy chọn không hỗ trợ")

        const student = await Parent.findOne({
            isDeleted: false,
            _id: studentId,
        })
        if (!student) throw new Error("Học sinh không tồn tại")

        const mainTeacher = await Teacher.findOne({
            isDeleted: false,
            mainTeacherOfClass: student.classRoom,
        })
        if (!mainTeacher) throw new Error("Giáo viên không tồn tại")

        if (type === "sms") {
            // send sms to teacher
            const body = smsToMainTeacherText
                .replace("$studentName$", student.studentName)
                .replace("$content$", content)

            const to =
                process.env.ENVIRONMENT === "DEVELOPMENT"
                    ? "+84335210659"
                    : mainTeacher.phoneNumber.replace("0", "+84")

            sendSms(to, body)
        }

        res.status(200).send("Gửi SMS thành công")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const { userInfo } = req
        const { password, newPassword } = req.body

        const isAdmin = userInfo.role === "admin"
        const isTeacher = userInfo.role === "teacher"
        const isParent = userInfo.role === "parent"

        const { _id } = userInfo

        console.log(userInfo)

        if (isAdmin) {
            const admin = await Admin.findOne({ isDeleted: false, _id })
            if (!admin) throw new Error("Người dùng không tồn tại")

            if (!passwordHash.verify(password, admin.password))
                throw new Error("Sai mật khẩu")

            if (!newPassword.trim() || newPassword.trim().length < 8)
                throw new Error("Mật khẩu phải bao gồm ít nhất 8 ký tự")

            admin.password = passwordHash.generate(newPassword)

            await admin.save()
        }

        if (isTeacher) {
            const teacher = await Teacher.findOne({ isDeleted: false, _id })
            if (!teacher) throw new Error("Người dùng không tồn tại")

            if (!passwordHash.verify(password, teacher.password))
                throw new Error("Sai mật khẩu")

            if (!newPassword.trim() || newPassword.trim().length < 8)
                throw new Error("Mật khẩu phải bao gồm ít nhất 8 ký tự")

            teacher.password = passwordHash.generate(newPassword)

            await teacher.save()
        }

        if (isParent) {
            const parent = await Parent.findOne({ isDeleted: false, _id })
            if (!parent) throw new Error("Người dùng không tồn tại")

            if (!passwordHash.verify(password, parent.password))
                throw new Error("Sai mật khẩu")

            if (!newPassword.trim() || newPassword.trim().length < 8)
                throw new Error("Mật khẩu phải bao gồm ít nhất 8 ký tự")

            parent.password = passwordHash.generate(newPassword)

            await parent.save()
        }

        res.status(200).send("Đổi mật khẩu thành công")
    } catch (err) {
        res.status(500).send(err.message)
    }
}
