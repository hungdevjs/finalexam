const express = require("express");
const auth = require("../middlewares/auth");

const { authAdmin } = auth;

const router = express.Router();

const controller = require("../controllers/information.controller");

router.get("/getAllClass", authAdmin, controller.getAllClass);

router.get("/getAllSubject", authAdmin, controller.getAllSubject);

module.exports = router;
