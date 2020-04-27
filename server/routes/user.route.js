const express = require("express")
const auth = require("../middlewares/auth")

const { authAdmin, authTeacherStudent } = auth

const router = express.Router()

const controller = require("../controllers/user.controller")

router.get("/getAllUser", authAdmin, controller.getAllUser)

router.delete("/:role/:id", authAdmin, controller.deleteUser)

router.post("/student/create", authAdmin, controller.createStudent)

router.get("/student/:id", controller.getStudent)

router.put("/student/:id", authAdmin, controller.updateStudent)

router.get("/teacher/:id", authAdmin, controller.getTeacher)

router.post("/teacher/create", authAdmin, controller.createTeacher)

router.put("/teacher/:id", authAdmin, controller.updateTeacher)

router.put("/profile/:role/:id", authTeacherStudent, controller.updateProfile)

module.exports = router
