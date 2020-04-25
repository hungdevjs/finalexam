const express = require("express")
const auth = require("../middlewares/auth")

const { authAdmin, authAdminTeacher } = auth

const router = express.Router()

const controller = require("../controllers/information.controller")

router.get("/getAllClass", authAdmin, controller.getAllClass)

router.get("/getAllSubject", authAdmin, controller.getAllSubject)

router.get("/schedule/:classRoom", controller.getClassSchedule)

router.get("/transcript/:studentId", controller.getStudentTranscript)

router.get("/teacher/:classRoom", controller.getTeacherOfClass)

router.get(
    "/teacher/schedule/:teacherId",
    authAdminTeacher,
    controller.getTeacherSchedule
)

router.get("/semester", controller.getSemester)

module.exports = router
