const jwt = require("jsonwebtoken")
const passwordHash = require("password-hash")

let Parent = require("../models/parent.model")
let Teacher = require("../models/teacher.model")
let Admin = require("../models/admin.model")

module.exports.logIn = (req, res) => {
    const role = req.body.role
    const identity = req.body.identity
    const password = req.body.password

    switch (role) {
        case "parent":
            return Parent.findOne({ studentId: identity, isDeleted: false })
                .then((student) => {
                    if (
                        student &&
                        passwordHash.verify(password, student.password)
                    ) {
                        const data = {
                            _id: student._id,
                            studentId: student.studentId,
                            studentName: student.studentName,
                            gender: student.gender,
                            grade: student.grade,
                            classRoom: student.classRoom,
                            dateOfBirth: student.dateOfBirth,
                            address: student.address,
                            note: student.note,
                            father: student.father,
                            mother: student.mother,
                            dayOff: student.dayOff,
                            role: "parent",
                        }

                        const access_token = jwt.sign(
                            data,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
                        )

                        let refresh_token = null

                        if (!student.refreshToken) {
                            refresh_token = jwt.sign(
                                data,
                                process.env.REFRESH_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_REFRESH_TOKEN_LIFE,
                                }
                            )

                            student.refreshToken = refresh_token

                            student.save()
                        } else {
                            try {
                                jwt.verify(
                                    student.refreshToken,
                                    process.env.REFRESH_TOKEN_SECRET_KEY
                                )
                                refresh_token = student.refreshToken
                            } catch {
                                refresh_token = jwt.sign(
                                    data,
                                    process.env.REFRESH_TOKEN_SECRET_KEY,
                                    {
                                        expiresIn:
                                            process.env.JWT_REFRESH_TOKEN_LIFE,
                                    }
                                )

                                student.refreshToken = refresh_token

                                student.save()
                            }
                        }

                        res.status(200).json({
                            data,
                            access_token,
                            refresh_token,
                            access_from: new Date().getTime(),
                        })
                    } else {
                        res.status(401).json("User's information is not valid")
                    }
                })
                .catch((err) => {
                    res.status(401).json(err.message)
                })

        case "teacher":
            return Teacher.findOne({ email: identity, isDeleted: false })
                .then((teacher) => {
                    if (
                        teacher &&
                        passwordHash.verify(password, teacher.password)
                    ) {
                        const data = {
                            _id: teacher._id,
                            name: teacher.name,
                            email: teacher.email,
                            phoneNumber: teacher.phoneNumber,
                            yearOfBirth: teacher.yearOfBirth,
                            gender: teacher.gender,
                            mainTeacherOfClass: teacher.mainTeacherOfClass,
                            teacherOfClass: teacher.teacherOfClass,
                            subject: teacher.subject,
                            role: "teacher",
                        }

                        const access_token = jwt.sign(
                            data,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
                        )

                        let refresh_token = null

                        if (!teacher.refreshToken) {
                            refresh_token = jwt.sign(
                                data,
                                process.env.REFRESH_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_REFRESH_TOKEN_LIFE,
                                }
                            )

                            teacher.refreshToken = refresh_token

                            teacher.save()
                        } else {
                            try {
                                jwt.verify(
                                    teacher.refreshToken,
                                    process.env.REFRESH_TOKEN_SECRET_KEY
                                )
                                refresh_token = teacher.refreshToken
                            } catch {
                                refresh_token = jwt.sign(
                                    data,
                                    process.env.REFRESH_TOKEN_SECRET_KEY,
                                    {
                                        expiresIn:
                                            process.env.JWT_REFRESH_TOKEN_LIFE,
                                    }
                                )

                                teacher.refreshToken = refresh_token

                                teacher.save()
                            }
                        }

                        res.status(200).json({
                            data,
                            access_token,
                            refresh_token,
                            access_from: new Date().getTime(),
                        })
                    } else {
                        res.status(401).json("User's information is not valid")
                    }
                })
                .catch((err) => {
                    res.status(401).json(err.message)
                })
        case "admin":
            return Admin.findOne({ email: identity, isDeleted: false })
                .then((admin) => {
                    if (
                        admin &&
                        passwordHash.verify(password, admin.password)
                    ) {
                        const data = {
                            _id: admin._id,
                            email: admin.email,
                            role: "admin",
                        }

                        const access_token = jwt.sign(
                            data,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
                        )

                        let refresh_token = null

                        if (!admin.refreshToken) {
                            refresh_token = jwt.sign(
                                data,
                                process.env.REFRESH_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_REFRESH_TOKEN_LIFE,
                                }
                            )

                            admin.refreshToken = refresh_token

                            admin.save()
                        } else {
                            try {
                                jwt.verify(
                                    admin.refreshToken,
                                    process.env.REFRESH_TOKEN_SECRET_KEY
                                )
                                refresh_token = admin.refreshToken
                            } catch {
                                refresh_token = jwt.sign(
                                    data,
                                    process.env.REFRESH_TOKEN_SECRET_KEY,
                                    {
                                        expiresIn:
                                            process.env.JWT_REFRESH_TOKEN_LIFE,
                                    }
                                )

                                admin.refreshToken = refresh_token

                                admin.save()
                            }
                        }

                        res.status(200).json({
                            data,
                            access_token,
                            refresh_token,
                            access_from: new Date().getTime(),
                        })
                    } else {
                        console.log(err.message)
                        res.status(401).json("User's information is not valid")
                    }
                })
                .catch((err) => {
                    res.status(401).json(err.message)
                })
        default:
            return res.status(400).json("Log in failed")
    }
}

module.exports.getUserInformation = async (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        switch (userInfo.role) {
            case "admin":
                const admin = await Admin.findOne({
                    _id: userInfo._id,
                    isDeleted: false,
                })
                if (!admin) {
                    throw new Error("Get user information failed")
                }
                return res.status(200).json({
                    data: {
                        _id: admin._id,
                        email: admin.email,
                        role: "admin",
                    },
                })

            case "teacher":
                const teacher = await Teacher.findOne({
                    _id: userInfo._id,
                    isDeleted: false,
                })
                if (!teacher) {
                    throw new Error("Get user information failed")
                }
                return res.status(200).json({
                    data: {
                        _id: teacher._id,
                        name: teacher.name,
                        email: teacher.email,
                        phoneNumber: teacher.phoneNumber,
                        yearOfBirth: teacher.yearOfBirth,
                        gender: teacher.gender,
                        mainTeacherOfClass: teacher.mainTeacherOfClass,
                        teacherOfClass: teacher.teacherOfClass,
                        subject: teacher.subject,
                        role: "teacher",
                    },
                })

            case "parent":
                const parent = await Parent.findOne({
                    _id: userInfo._id,
                    isDeleted: false,
                })
                if (!parent) {
                    throw new Error("Get user information failed")
                }
                return res.status(200).json({
                    data: {
                        _id: parent._id,
                        studentId: parent.studentId,
                        studentName: parent.studentName,
                        classRoom: parent.classRoom,
                        gender: parent.gender,
                        grade: parent.grade,
                        dateOfBirth: parent.dateOfBirth,
                        address: parent.address,
                        note: parent.note,
                        father: parent.father,
                        mother: parent.mother,
                        dayOff: parent.dayOff,
                        role: "parent",
                    },
                })

            default:
                return res.status(401).json("Unthorizated")
        }
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports.getUserInformationAndNewAccessToken = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.REFRESH_TOKEN_SECRET_KEY)

        switch (userInfo.role) {
            case "admin":
                return Admin.findOne({ refreshToken: token, isDeleted: false })
                    .then((admin) => {
                        if (
                            admin &&
                            jwt.verify(
                                token,
                                process.env.REFRESH_TOKEN_SECRET_KEY
                            )
                        ) {
                            const data = {
                                _id: admin._id,
                                email: admin.email,
                                role: "admin",
                            }

                            const access_token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_ACCESS_TOKEN_LIFE,
                                }
                            )

                            res.status(200).json({
                                data,
                                access_token,
                                refresh_token: token,
                                access_from: new Date().getTime(),
                            })
                        } else {
                            res.status(401).json("Unthorizated")
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(err.message)
                    })

            case "teacher":
                return Teacher.findOne({
                    refreshToken: token,
                    isDeleted: false,
                })
                    .then((teacher) => {
                        if (
                            teacher &&
                            jwt.verify(
                                token,
                                process.env.REFRESH_TOKEN_SECRET_KEY
                            )
                        ) {
                            const data = {
                                _id: teacher._id,
                                name: teacher.name,
                                email: teacher.email,
                                phoneNumber: teacher.phoneNumber,
                                yearOfBirth: teacher.yearOfBirth,
                                gender: teacher.gender,
                                mainTeacherOfClass: teacher.mainTeacherOfClass,
                                teacherOfClass: teacher.teacherOfClass,
                                subject: teacher.subject,
                                role: "teacher",
                            }

                            const access_token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_ACCESS_TOKEN_LIFE,
                                }
                            )

                            res.status(200).json({
                                data,
                                access_token,
                                refresh_token: token,
                                access_from: new Date().getTime(),
                            })
                        } else {
                            res.status(401).json("Unthorizated")
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(err.message)
                    })

            case "parent":
                return Parent.findOne({ refreshToken: token, isDeleted: false })
                    .then((student) => {
                        if (
                            student &&
                            jwt.verify(
                                token,
                                process.env.REFRESH_TOKEN_SECRET_KEY
                            )
                        ) {
                            const data = {
                                _id: student._id,
                                studentId: student.studentId,
                                studentName: student.studentName,
                                classRoom: student.classRoom,
                                gender: student.gender,
                                grade: student.grade,
                                dateOfBirth: student.dateOfBirth,
                                address: student.address,
                                note: student.note,
                                father: student.father,
                                mother: student.mother,
                                dayOff: student.dayOff,
                                role: "parent",
                            }

                            const access_token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_ACCESS_TOKEN_LIFE,
                                }
                            )

                            res.status(200).json({
                                data,
                                access_token,
                                refresh_token: token,
                                access_from: new Date().getTime(),
                            })
                        } else {
                            res.status(401).json("Unthorizated")
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(err.message)
                    })

            default:
                return res.status(401).json("Unthorizated")
        }
    } catch (err) {
        res.status(401).send(err.message)
    }
}
