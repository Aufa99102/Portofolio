const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");

router.get("/api/skills", skillController.getSkills);

module.exports = router;