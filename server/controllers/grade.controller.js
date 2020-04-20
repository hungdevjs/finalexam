const jwt = require("jsonwebtoken");

let Grade = require("../models/grade.model");

module.exports.getAllGrade = (req, res) => {
    try {
        Grade.find({ isDeleted: false })
            .then((grades) => {
                if (grades) {
                    res.status(200).json(
                        grades.sort((item1, item2) => item1.grade - item2.grade)
                    );
                } else {
                    res.status(200).json([]);
                }
            })
            .catch((err) => {
                res.status(500).send(err.message);
            });
    } catch (err) {
        res.status(401).send(err.message);
    }
};

module.exports.getAllClassOfGrade = (req, res) => {
    try {
        const grade = req.params.grade;

        Grade.findOne({ isDeleted: false, grade })
            .then((grade) => {
                if (grade) {
                    res.status(200).json(grade.classRoom.sort());
                } else {
                    res.status(200).json([]);
                }
            })
            .catch((err) => {
                res.status(500).send(err.message);
            });
    } catch (err) {
        res.status(401).send(err.message);
    }
};
