const testimonialModel = require("../models/testimonialModel");

const getTestimonials = (req, res) => {
    testimonialModel.getAllTestimonials((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get Testimonials data",
                error: err.message,
            });
        }
        res.json({
            success: true,
            message: "Get Testimonials data successed",
            data: results,
        });
    });
};

module.exports = {
    getTestimonials,
}