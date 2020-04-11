const jwt = require('jsonwebtoken')

let Grade = require('../models/grade.model')

module.exports.getAllGrade = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (userInfo.role !== 'admin') {
            return res.status(401).send('Unthorizated')
        }

        Grade.find({ isDeleted: false })
            .then(grades => {
                if (grades) {
                    res.status(200).json(grades.sort((item1, item2) => item1.grade - item2.grade))
                } else {
                    res.status(200).json([])
                }
            })
            .catch(err => {
                res.status(500).send(err.message)
            })

    } catch(err) {
        res.status(401).send(err.message)
    }
}

module.exports.getAllClassOfGrade = (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : ""

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        const userInfo = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        if (userInfo.role !== 'admin') {
            return res.status(401).send('Unthorizated')
        }

        const grade = req.params.grade 

        Grade.findOne({ isDeleted: false, grade })
            .then(grade => {
                if (grade) {
                    res.status(200).json(grade.classRoom.sort())
                } else {
                    res.status(200).json([])
                }
            })
            .catch(err =>{
                res.status(500).send(err.message)
            })

    } catch(err) {
        res.status(401).send(err.message)
    }
}