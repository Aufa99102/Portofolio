const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

router.get("/api/certificates", certificateController.getCertificates);

module.exports = router;