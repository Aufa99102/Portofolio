const projectModel = require("../models/projectModel");

const getProjects = (req, res) => {
    projectModel.getAllProjects((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil data proyek",
                error: err.message,
            });
        }
        res.json({
            success: true,
            message: "Data proyek berhasil diambil",
            data: results
        });
    });
};

const getProjectDetail = (req, res) => {
    const { id } = req.params;
    projectModel.getProjectById(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil detail proyek",
                error: err.message,
            });
        }
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Proyek tidak ditemukan"
            });
        }
        res.json({
            success: true,
            message: "Detail proyek berhasil diambil",
            data: result,
        });
    });
};

const createProject = (req, res) => {
    const { title, category, description, tech, demo_url, github_url, demoUrl, githubUrl } = req.body;

    if (!title || !category) {
        return res.status(400).json({
            success: false,
            message: "Judul dan kategori proyek wajib diisi",
        });
    }

    const projectData = {
        title,
        category,
        description: description || "",
        tech: tech || [],
        demo_url: demo_url || demoUrl || "",
        github_url: github_url || githubUrl || "",
    };

    projectModel.createProject(projectData, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal menambahkan proyek",
                error: err.message,
            });
        }
        res.status(201).json({
            success: true,
            message: "Proyek berhasil ditambahkan",
            data: {
                id: results.insertId,
                ...projectData,
            },
        });
    });
};

const updateProject = (req, res) => {
    const { id } = req.params;
    const { title, category, description, tech, demo_url, github_url, demoUrl, githubUrl } = req.body;

    if (!title || !category) {
        return res.status(400).json({
            success: false,
            message: "Judul dan kategori proyek wajib diisi",
        });
    }

    projectModel.getProjectById(id, (err, existing) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal memeriksa data proyek",
                error: err.message,
            });
        }
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Proyek tidak ditemukan",
            });
        }

        const projectData = {
            title,
            category,
            description: description !== undefined ? description : existing.description,
            tech: tech !== undefined ? tech : existing.tech,
            demo_url: demo_url !== undefined ? demo_url : (demoUrl !== undefined ? demoUrl : existing.demo_url),
            github_url: github_url !== undefined ? github_url : (githubUrl !== undefined ? githubUrl : existing.github_url),
        };

        projectModel.updateProject(id, projectData, (updateErr, results) => {
            if (updateErr) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal memperbarui proyek",
                    error: updateErr.message,
                });
            }
            res.json({
                success: true,
                message: "Proyek berhasil diperbarui",
                data: {
                    id: Number(id),
                    ...projectData,
                },
            });
        });
    });
};

const deleteProject = (req, res) => {
    const { id } = req.params;

    projectModel.getProjectById(id, (err, existing) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Gagal memeriksa data proyek",
                error: err.message,
            });
        }
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Proyek tidak ditemukan",
            });
        }

        projectModel.deleteProject(id, (deleteErr, results) => {
            if (deleteErr) {
                return res.status(500).json({
                    success: false,
                    message: "Gagal menghapus proyek",
                    error: deleteErr.message,
                });
            }
            res.json({
                success: true,
                message: "Proyek berhasil dihapus",
            });
        });
    });
};

module.exports = {
    getProjects,
    getProjectDetail,
    createProject,
    updateProject,
    deleteProject,
};