const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const _ = require("lodash");

const validateDate = require("../utils/validateDate");

const Parent = require("../models/parent.model");
const Teacher = require("../models/teacher.model");
const Admin = require("../models/admin.model");
const Grade = require("../models/grade.model");

module.exports.getUserInformation = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);

        switch (userInfo.role) {
            case "admin":
                return res.status(200).json({
                    data: {
                        email: userInfo.email,
                        role: "admin",
                    },
                });

            case "teacher":
                return res.status(200).json({
                    data: {
                        name: userInfo.name,
                        email: userInfo.email,
                        phoneNumber: userInfo.phoneNumber,
                        yearOfBirth: userInfo.yearOfBirth,
                        gender: userInfo.gender,
                        mainTeacherOfClass: userInfo.mainTeacherOfClass,
                        teacherOfClass: userInfo.teacherOfClass,
                        subject: userInfo.subject,
                        role: "teacher",
                    },
                });

            case "parent":
                return res.status(200).json({
                    data: {
                        studentId: userInfo.studentId,
                        studentName: userInfo.studentName,
                        class: userInfo.class,
                        role: "parent",
                    },
                });

            default:
                return res.status(401).json("Unthorizated");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports.getUserInformationAndNewAccessToken = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";

    try {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
        const userInfo = jwt.decode(
            token,
            process.env.REFRESH_TOKEN_SECRET_KEY
        );

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
                                email: admin.email,
                                role: "admin",
                            };

                            const access_token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_ACCESS_TOKEN_LIFE,
                                }
                            );

                            res.status(200).json({
                                data,
                                access_token,
                                refresh_token: token,
                                access_from: new Date().getTime(),
                            });
                        } else {
                            res.status(401).json("Unthorizated");
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(err.message);
                    });

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
                                name: teacher.name,
                                email: teacher.email,
                                phoneNumber: teacher.phoneNumber,
                                yearOfBirth: teacher.yearOfBirth,
                                gender: teacher.gender,
                                mainTeacherOfClass: teacher.mainTeacherOfClass,
                                teacherOfClass: teacher.teacherOfClass,
                                subject: teacher.subject,
                                role: "teacher",
                            };

                            const access_token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_ACCESS_TOKEN_LIFE,
                                }
                            );

                            res.status(200).json({
                                data,
                                access_token,
                                refresh_token: token,
                                access_from: new Date().getTime(),
                            });
                        } else {
                            res.status(401).json("Unthorizated");
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(err.message);
                    });

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
                                studentId: student.studentId,
                                studentName: student.studentName,
                                class: student.class,
                                role: "parent",
                            };

                            const access_token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET_KEY,
                                {
                                    expiresIn:
                                        process.env.JWT_ACCESS_TOKEN_LIFE,
                                }
                            );

                            res.status(200).json({
                                data,
                                access_token,
                                refresh_token: token,
                                access_from: new Date().getTime(),
                            });
                        } else {
                            res.status(401).json("Unthorizated");
                        }
                    })
                    .catch((err) => {
                        res.status(500).send(err.message);
                    });

            default:
                return res.status(401).json("Unthorizated");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports.getAllUser = (req, res) => {
    try {
        const {
            role,
            searchString,
            filterClass,
            filterGrade,
            filterSubject,
        } = req.query;

        if (role === "student") {
            Parent.find({ isDeleted: false })
                .then((students) => {
                    if (students) {
                        let data = [...students];

                        if (searchString) {
                            data = data.filter((student) =>
                                student.studentName
                                    .toUpperCase()
                                    .includes(searchString.toUpperCase())
                            );
                        }

                        if (filterClass) {
                            data = data.filter(
                                (student) => student.classRoom === filterClass
                            );
                        }

                        if (filterGrade) {
                            data = data.filter(
                                (student) =>
                                    student.grade === parseInt(filterGrade)
                            );
                        }

                        res.status(200).json({
                            data: data.map((student) => ({
                                id: student._id,
                                classRoom: student.classRoom,
                                grade: student.grade,
                                studentName: student.studentName,
                            })),
                        });
                    } else {
                        res.status(200).json([]);
                    }
                })
                .catch((err) => {
                    res.status(500).send(err.message);
                });
        } else if (role === "teacher") {
            Teacher.find({ isDeleted: false })
                .then((teachers) => {
                    if (teachers) {
                        let data = [...teachers];

                        if (searchString) {
                            data = data.filter((teacher) =>
                                teacher.name
                                    .toUpperCase()
                                    .includes(searchString.toUpperCase())
                            );
                        }

                        if (filterClass) {
                            data = data.filter(
                                (teacher) =>
                                    teacher.teacherOfClass.includes(
                                        filterClass
                                    ) ||
                                    teacher.mainTeacherOfClass.includes(
                                        filterClass
                                    )
                            );
                        }

                        if (filterSubject) {
                            data = data.filter(
                                (teacher) => teacher.subject === filterSubject
                            );
                        }

                        res.status(200).json({
                            data: data.map((teacher) => ({
                                id: teacher._id,
                                name: teacher.name,
                                email: teacher.email,
                            })),
                        });
                    } else {
                        res.status(200).json([]);
                    }
                })
                .catch((err) => {
                    res.status(500).send(err.message);
                });
        } else {
            res.status(400).send("Bad request");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports.deleteUser = (req, res) => {
    try {
        const { role, id } = req.params;

        switch (role) {
            case "student":
                return Parent.findOne({ _id: id })
                    .then(async (student) => {
                        if (student) {
                            student.isDeleted = true;
                            await student.save();
                            res.status(200).json("Student is deleted");
                        } else {
                            res.status(400).json("Bad request");
                        }
                    })
                    .catch((err) => {
                        res.status(500).json(err.message);
                    });

            case "teacher":
                return;
            default:
                return res.status(400).json("Bad request");
        }
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports.createStudent = (req, res) => {
    try {
        const data = req.body;
        const { grade, classRoom, dateOfBirth } = data;

        Grade.findOne({ isDeleted: false, grade })
            .then((gr) => {
                if (!validateDate(dateOfBirth))
                    throw new Error("Date of birth is not valid");

                if (!gr) throw new Error("Student grade doesn't exist");

                if (gr && !gr.classRoom.includes(classRoom))
                    throw new Error("Student class doesn't exist");

                data.studentId = shortid.generate();

                if (process.env.ENVIRONMENT === "DEVELOPMENT") {
                    data.password = passwordHash.generate("12345678");
                } else {
                    data.password = shortid.generate();
                }

                data.score = {};
                data.isDeleted = false;

                const newStudent = new Parent(data);

                newStudent.save().then(() => res.status(201).json(data));
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.getStudent = (req, res) => {
    try {
        const id = req.params.id;

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
                    } = student;
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
                    };

                    res.status(200).json(data);
                } else {
                    res.status(200).json("Student doesn't exist");
                }
            })
            .catch((err) => {
                res.status(500).send(err.message);
            });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.updateStudent = (req, res) => {
    try {
        const id = req.params.id;

        Parent.findOne({ _id: id, isDeleted: false })
            .then((student) => {
                if (student) {
                    const data = req.body;
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
                    } = data;

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
                    ];

                    Grade.findOne({ isDeleted: false, grade })
                        .then(async (gr) => {
                            if (!validateDate(dateOfBirth))
                                throw new Error("Date of birth is not valid");

                            if (!gr)
                                throw new Error("Student grade doesn't exist");

                            if (gr && !gr.classRoom.includes(classRoom))
                                throw new Error("Student class doesn't exist");

                            updateArr.forEach((item) => {
                                student[item.field] = item.value;
                            });

                            await student.save();
                            res.status(200).send("Update successfully");
                        })
                        .catch((err) => {
                            res.status(400).send(err.message);
                        });
                } else {
                    res.status(400).send("Student doesn't exist");
                }
            })
            .catch((err) => {
                res.status(500).send(err.message);
            });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.getTeacher = (req, res) => {
    try {
        const id = req.params.id;

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
                    } = teacher;
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
                    };

                    res.status(200).json(data);
                } else {
                    res.status(200).json("Teacher doesn't exist");
                }
            })
            .catch((err) => {
                res.status(500).send(err.message);
            });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.createTeacher = async (req, res) => {
    try {
        const data = req.body;
        const {
            name,
            yearOfBirth,
            gender,
            email,
            phoneNumber,
            mainTeacherOfClass,
            subject,
            teacherOfClass,
        } = data;

        // check if teacher email exist
        const teacher = await Teacher.findOne({ email, isDeleted: false });
        if (teacher) {
            throw new Error("Teacher email exist");
        }

        // check if mainClass exist
        if (
            Array.isArray(mainTeacherOfClass) ||
            mainTeacherOfClass.length > 0
        ) {
            let classes = [];
            const grades = await Grade.find();
            if (grades) {
                for (const item of grades) {
                    classes = [...classes, ...item.classRoom];
                }
            }

            for (room of mainTeacherOfClass) {
                if (!classes.includes(room)) {
                    throw new Error("Class doesn't exist");
                }

                const mainClass = await Teacher.find().distinct(
                    "mainTeacherOfClass"
                );

                const invalidMainclass = mainTeacherOfClass.filter((item) =>
                    mainClass.includes(item)
                );

                if (invalidMainclass.length > 0) {
                    throw new Error(
                        `Class ${invalidMainclass.join(", ")} had main teacher`
                    );
                }
            }
        }

        // check if subject-teacherClass exist
        const classSameSubject = await Teacher.find({
            subject,
            isDeleted: false,
        }).distinct("teacherOfClass");

        const invalidSubjectClass = teacherOfClass.filter((item) =>
            classSameSubject.includes(item)
        );

        if (invalidSubjectClass.length > 0) {
            throw new Error(
                `Class ${invalidSubjectClass.join(
                    ", "
                )} had teacher for ${subject}`
            );
        }

        data.isDeleted = false;
        if (process.env.ENVIRONMENT === "DEVELOPMENT") {
            data.password = passwordHash.generate("12345678");
        } else {
            data.password = shortid.generate();
        }

        const newTeacher = new Teacher(data);
        newTeacher.save().then(() => res.status(201).json(data));
    } catch (err) {
        res.status(500).send(err.message);
    }
};
