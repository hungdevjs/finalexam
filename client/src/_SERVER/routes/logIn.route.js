const express = require('express')

const router = express.Router()

const controller = require('../controllers/logIn.controller')

router.post('/', controller)

module.exports = router