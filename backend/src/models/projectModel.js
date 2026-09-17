const db = require("../config/db");

const getAllProjects = (callback) => {
    const query = "SELECT * FROM projects ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

const getProjectById = (id, callback) => {
    const query = "SELECT * FROM projects WHERE id = ?";
    db.query(query, [id], (err, results) => {
        callback(err, results ? results[0] : null);
    });
};

const createProject = (data, callback) => {
    const query = "INSERT INTO projects (title, category, description, tech, demo_url, github_url) VALUES (?, ?, ?, ?, ?, ?)";
    const techVal = Array.isArray(data.tech) ? JSON.stringify(data.tech) : (typeof data.tech === "string" ? data.tech : "[]");
    db.query(query, [data.title, data.category, data.description || "", techVal, data.demo_url || "", data.github_url || ""], (err, results) => {
        callback(err, results);
    });
};

const updateProject = (id, data, callback) => {
    const query = "UPDATE projects SET title = ?, category = ?, description = ?, tech = ?, demo_url = ?, github_url = ? WHERE id = ?";
    const techVal = Array.isArray(data.tech) ? JSON.stringify(data.tech) : (typeof data.tech === "string" ? data.tech : "[]");
    db.query(query, [data.title, data.category, data.description || "", techVal, data.demo_url || "", data.github_url || "", id], (err, results) => {
        callback(err, results);
    });
};

const deleteProject = (id, callback) => {
    const query = "DELETE FROM projects WHERE id = ?";
    db.query(query, [id], (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};