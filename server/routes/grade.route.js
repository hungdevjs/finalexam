const express = require('express')

const router = express.Router()

const controller = require('../controllers/grade.controller')

router.get('/getAllGrade', controller.getAllGrade)

router.get('/getAllClassOfGrade/:grade', controller.getAllClassOfGrade)

module.exports = router