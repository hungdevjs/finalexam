const jwt = require("jsonwebtoken");

let Parent = require("../models/parent.model");
let Teacher = require("../models/teacher.model");
let Grade = require("../models/grade.model");

module.exports.getAllClass = (req, res) => {
    try {
        Grade.find()
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
        const subjects = [
            "Toán",
            "Văn",
            "Anh",
            "Vật lý",
            "Hóa học",
            "Sinh học",
        ].sort();

        res.status(200).send(subjects);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
