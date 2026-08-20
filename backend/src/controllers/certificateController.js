const certificateModel = require("../models/certificateModel");

const getCertificates = (req,res) => {
    certificateModel.getAllCetificates((err, results) => {
        if (err) {
            return res.status(500).json ({
                success: false,
                message: "Failed to get certificates data",
                error: err.message,
            });
        }
        res.json({
            success: true,
            message: "Get certificate data succeeded",
            data: results,
        });
    });
};

module.exports = {
    getCertificates,
};