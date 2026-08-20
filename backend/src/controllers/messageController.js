const messageModel = require("../models/messageModel");

const sendMessage = (req, res) => {
    const { nama, email, subject, message } = req.body;

    if ( !nama || !email || !message ) {
        return res.status(400).json({
            success: false,
            message: "Fill The Colomn to Continue"
        });
    }

    const data = { nama, email, subject : subject || " ", message };

    messageModel.createMessage(data, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to save Message",
                error: err.message,
            });
        }
        res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: {
                id: results.insertId,
                nama,
                email,
                subject,
                message,
            },
        });
    });
};

const getMessages = (req, res) => {
    messageModel.getAllMessage((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to Get Data",
                error: err.message,
            });
        }
        res.json({
            success: true,
            message: "Successed to Get Data",
            data: results,
        });
    });
};

module.exports = {
    sendMessage,
    getMessages,
};