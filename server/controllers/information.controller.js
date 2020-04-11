const jwt = require('jsonwebtoken')

let Parent = require('../models/parent.model')
let Teacher = require('../models/teacher.model')
let Grade = require('../models/grade.model')

module.exports.getAllClass = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (userInfo.role !== 'admin') {
            return res.status(401).send('Unthorizated')
        }

        Grade.find()
            .then(grades => {
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
            .then(data => res.status(200).json(data))
            .catch(err => {
                res.status(500).send(err.message)
            })
    } catch(err) {
        res.status(500).send(err.message)
    }  
}

module.exports.getAllSubject = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (userInfo.role !== 'admin') {
            return res.status(401).send('Unthorizated')
        }

        Teacher.find()
            .then(teachers => {
                if (teachers) {
                    let subjects = []

                    for (let teacher of teachers) {
                        subjects = [...subjects, teacher.subject]
                    }

                    return [...new Set(subjects)]
                } else {
                    return []
                }
            })
            .then(data => res.status(200).json(data))
            .catch(err => {
                res.status(500).send(err.message)
            })
    } catch(err) {
        res.status(500).send(err.message)
    }  
}