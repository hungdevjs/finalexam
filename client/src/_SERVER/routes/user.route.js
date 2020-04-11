const express = require('express')

const router = express.Router()

const controller = require('../controllers/user.controller')

router.get('/getUserInformation', controller.getUserInformation)

router.get('/getUserInformationAndNewAccessToken', controller.getUserInformationAndNewAccessToken)

router.get('/getAllUser', controller.getAllUser)

router.delete('/:role/:id', controller.deleteUser)

router.post('/student/create', controller.createStudent)

router.get('/student/:id', controller.getStudent)

router.put('/student/:id', controller.updateStudent)

module.exports = router