const express = require('express')

const router = express.Router()

const controller = require('../controllers/information.controller')

router.get('/getAllClass', controller.getAllClass)

// router.get('/getAllGrade', controller.getAllGrade)

router.get('/getAllSubject', controller.getAllSubject)

module.exports = router