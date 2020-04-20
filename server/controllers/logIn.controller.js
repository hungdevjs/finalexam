const jwt = require("jsonwebtoken");
const passwordHash = require("password-hash");

let Parent = require("../models/parent.model");
let Teacher = require("../models/teacher.model");
let Admin = require("../models/admin.model");

module.exports = (req, res) => {
    const role = req.body.role;
    const identity = req.body.identity;
    const password = req.body.password;

    switch (role) {
        case "parent":
            return Parent.findOne({ studentId: identity, isDeleted: false })
                .then((student) => {
                    if (
                        student &&
                        passwordHash.verify(password, student.password)
                    ) {
                        const data = {
                            studentId: student.studentId,
                            studentName: student.studentName,
                            class: student.class,
                            role: "parent",
                        };

                        const access_token = jwt.sign(
                            data,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
                        );

                        let refresh_token = null;

                        if (!student.refreshToken) {
                            refresh_token = jwt.sign(
                                data,
                                process.env.REFRESH_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_REFRESH_TOKEN_LIFE,
                                }
                            );

                            student.refreshToken = refresh_token;

                            student.save();
                        } else {
                            try {
                                jwt.verify(
                                    student.refreshToken,
                                    process.env.REFRESH_TOKEN_SECRET_KEY
                                );
                                refresh_token = student.refreshToken;
                            } catch {
                                refresh_token = jwt.sign(
                                    data,
                                    process.env.REFRESH_TOKEN_SECRET_KEY,
                                    {
                                        expiresIn:
                                            process.env.JWT_REFRESH_TOKEN_LIFE,
                                    }
                                );

                                student.refreshToken = refresh_token;

                                student.save();
                            }
                        }

                        res.status(200).json({
                            data,
                            access_token,
                            refresh_token,
                            access_from: new Date().getTime(),
                        });
                    } else {
                        res.status(401).json("User's information is not valid");
                    }
                })
                .catch((err) => {
                    res.status(401).json(err.message);
                });

        case "teacher":
            return Teacher.findOne({ email: identity, isDeleted: false })
                .then((teacher) => {
                    if (
                        teacher &&
                        passwordHash.verify(password, teacher.password)
                    ) {
                        const data = {
                            name: teacher.name,
                            email: teacher.email,
                            phoneNumber: teacher.phoneNumber,
                            yearBorn: teacher.yearBorn,
                            gender: teacher.gender,
                            mainTeacherOfClass: teacher.mainTeacherOfClass,
                            teacherOfClass: teacher.teacherOfClass,
                            subject: teacher.subject,
                            role: "teacher",
                        };

                        const access_token = jwt.sign(
                            data,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
                        );

                        let refresh_token = null;

                        if (!teacher.refreshToken) {
                            refresh_token = jwt.sign(
                                data,
                                process.env.REFRESH_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_REFRESH_TOKEN_LIFE,
                                }
                            );

                            teacher.refreshToken = refresh_token;

                            teacher.save();
                        } else {
                            try {
                                jwt.verify(
                                    teacher.refreshToken,
                                    process.env.REFRESH_TOKEN_SECRET_KEY
                                );
                                refresh_token = teacher.refreshToken;
                            } catch {
                                refresh_token = jwt.sign(
                                    data,
                                    process.env.REFRESH_TOKEN_SECRET_KEY,
                                    {
                                        expiresIn:
                                            process.env.JWT_REFRESH_TOKEN_LIFE,
                                    }
                                );

                                teacher.refreshToken = refresh_token;

                                teacher.save();
                            }
                        }

                        res.status(200).json({
                            data,
                            access_token,
                            refresh_token,
                            access_from: new Date().getTime(),
                        });
                    } else {
                        res.status(401).json("User's information is not valid");
                    }
                })
                .catch((err) => {
                    res.status(401).json(err.message);
                });
        case "admin":
            return Admin.findOne({ email: identity, isDeleted: false })
                .then((admin) => {
                    if (
                        admin &&
                        passwordHash.verify(password, admin.password)
                    ) {
                        const data = {
                            email: admin.email,
                            role: "admin",
                        };

                        const access_token = jwt.sign(
                            data,
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
                        );

                        let refresh_token = null;

                        if (!admin.refreshToken) {
                            refresh_token = jwt.sign(
                                data,
                                process.env.REFRESH_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_REFRESH_TOKEN_LIFE,
                                }
                            );

                            admin.refreshToken = refresh_token;

                            admin.save();
                        } else {
                            try {
                                jwt.verify(
                                    admin.refreshToken,
                                    process.env.REFRESH_TOKEN_SECRET_KEY
                                );
                                refresh_token = admin.refreshToken;
                            } catch {
                                refresh_token = jwt.sign(
                                    data,
                                    process.env.REFRESH_TOKEN_SECRET_KEY,
                                    {
                                        expiresIn:
                                            process.env.JWT_REFRESH_TOKEN_LIFE,
                                    }
                                );

                                admin.refreshToken = refresh_token;

                                admin.save();
                            }
                        }

                        res.status(200).json({
                            data,
                            access_token,
                            refresh_token,
                            access_from: new Date().getTime(),
                        });
                    } else {
                        console.log(err.message);
                        res.status(401).json("User's information is not valid");
                    }
                })
                .catch((err) => {
                    res.status(401).json(err.message);
                });
        default:
            return res.status(400).json("Log in failed");
    }
};
