const jwt = require("jsonwebtoken");
const { subjects } = require("../utils/constant");

let Parent = require("../models/parent.model");
let Teacher = require("../models/teacher.model");
let Grade = require("../models/grade.model");

module.exports.getAllClass = (req, res) => {
    try {
        Grade.find({ isDeleted: false })
            .then((grades) => {
                if (grades) {
                    let classes = [];

                    for (let grade of grades) {
                        classes = [...classes, ...grade.classRoom];
                    }

                    return classes.sort();
                } else {
                    return [];
                }
            })
            .then((data) => res.status(200).json(data))
            .catch((err) => {
                res.status(500).send(err.message);
            });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.getAllSubject = (req, res) => {
    try {
        res.status(200).send(subjects.sort());
    } catch (err) {
        res.status(500).send(err.message);
    }
};
