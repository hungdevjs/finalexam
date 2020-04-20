const express = require("express");
const auth = require("../middlewares/auth");

const { authAdmin, authAdminTeacher } = auth;

const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/getUserInformation", controller.getUserInformation);

router.get(
    "/getUserInformationAndNewAccessToken",
    controller.getUserInformationAndNewAccessToken
);

router.get("/getAllUser", authAdmin, controller.getAllUser);

router.delete("/:role/:id", authAdmin, controller.deleteUser);

router.post("/student/create", authAdmin, controller.createStudent);

router.get("/student/:id", authAdminTeacher, controller.getStudent);

router.put("/student/:id", authAdmin, controller.updateStudent);

router.get("/teacher/:id", authAdmin, controller.getTeacher);

module.exports = router;
