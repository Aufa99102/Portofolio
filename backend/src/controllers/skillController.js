const skillModel = require("../models/skillModel");

const getSkills = (req,res) => {
    skillModel.getAllSkills((err, results) => {
        if (err) {
            return res.status(500).json ({
                success: false,
                message: "Failed to get skill data",
                error: err.message,
            });
        }
        res.json({
            success: true,
            message: "get data skills successed"
        });
    });
};

module.exports = {
    getSkills,
}