const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post("/api/messages", messageController.sendMessage);

router.get("/api/messages", messageController.getMessages);

module.exports = router;