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

const getTestimonialDetail = (req, res) => {
    const { id } = req.params;
    testimonialModel.getTestimonialById(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil detail testimoni",
                error: err.message,
            });
        }
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Testimoni tidak ditemukan",
            });
        }
        res.json({
            success: true,
            message: "Detail testimoni berhasil diambil",
            data: result,
        });
    });
};

const createTestimonial = (req, res) => {
    const { name, role, company, avatar, stars, quote } = req.body;

    if (!name || !quote) {
        return res.status(400).json({
            success: false,
            message: "Nama dan testimoni wajib diisi",
        });
    }

    const data = {
        name,
        role: role || "",
        company: company || "",
        avatar: avatar || "👤",
        stars: Number(stars) || 5,
        quote,
    };

    testimonialModel.createTestimonial(data, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal menambahkan testimoni",
                error: err.message,
            });
        }
        res.status(201).json({
            success: true,
            message: "Testimoni berhasil ditambahkan",
            data: {
                id: results.insertId,
                ...data,
            },
        });
    });
};

const updateTestimonial = (req, res) => {
    const { id } = req.params;
    const { name, role, company, avatar, stars, quote } = req.body;

    if (!name || !quote) {
        return res.status(400).json({
            success: false,
            message: "Nama dan testimoni wajib diisi",
        });
    }

    testimonialModel.getTestimonialById(id, (err, existing) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal memeriksa data testimoni",
                error: err.message,
            });
        }
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Testimoni tidak ditemukan",
            });
        }

        const data = {
            name,
            role: role !== undefined ? role : existing.role,
            company: company !== undefined ? company : existing.company,
            avatar: avatar !== undefined ? avatar : existing.avatar,
            stars: stars !== undefined ? Number(stars) : existing.stars,
            quote: quote !== undefined ? quote : existing.quote,
        };

        testimonialModel.updateTestimonial(id, data, (updateErr, results) => {
            if (updateErr) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal memperbarui testimoni",
                    error: updateErr.message,
                });
            }
            res.json({
                success: true,
                message: "Testimoni berhasil diperbarui",
                data: {
                    id: Number(id),
                    ...data,
                },
            });
        });
    });
};

const deleteTestimonial = (req, res) => {
    const { id } = req.params;

    testimonialModel.getTestimonialById(id, (err, existing) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal memeriksa data testimoni",
                error: err.message,
            });
        }
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Testimoni tidak ditemukan",
            });
        }

        testimonialModel.deleteTestimonial(id, (deleteErr, results) => {
            if (deleteErr) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal menghapus testimoni",
                    error: deleteErr.message,
                });
            }
            res.json({
                success: true,
                message: "Testimoni berhasil dihapus",
            });
        });
    });
};

module.exports = {
    getTestimonials,
    getTestimonialDetail,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};