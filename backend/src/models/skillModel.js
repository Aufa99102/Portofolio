const db = require("../config/db");

const getAllSkills = (callback) => {
    const query =
    `SELECT
        skills.id,
        skills.skill_group_id,
        skills.name,
        skills.level,
        skills.percentage,
        skill_groups.title AS group_title,
        skill_groups.icon AS group_icon
    FROM skills
    JOIN skill_groups ON skills.skill_group_id = skill_groups.id
    ORDER BY skill_groups.id ASC, skills.id ASC`;

    db.query(query, (err, results) => {
        callback(err, results);
    });
};

const getSkillById = (id, callback) => {
    const query = "SELECT * FROM skills WHERE id = ?";
    db.query(query, [id], (err, results) => {
        callback(err, results ? results[0] : null);
    });
};

const createSkill = (data, callback) => {
    const query = "INSERT INTO skills (skill_group_id, name, level, percentage) VALUES (?, ?, ?, ?)";
    db.query(query, [data.skill_group_id, data.name, data.level, data.percentage], (err, results) => {
        callback(err, results);
    });
};

const updateSkill = (id, data, callback) => {
    const query = "UPDATE skills SET skill_group_id = ?, name = ?, level = ?, percentage = ? WHERE id = ?";
    db.query(query, [data.skill_group_id, data.name, data.level, data.percentage, id], (err, results) => {
        callback(err, results);
    });
};

const deleteSkill = (id, callback) => {
    const query = "DELETE FROM skills WHERE id = ?";
    db.query(query, [id], (err, results) => {
        callback(err, results);
    });
};

const getAllSkillGroups = (callback) => {
    const query = "SELECT * FROM skill_groups ORDER BY id ASC";
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

const createSkillGroup = (data, callback) => {
    const query = "INSERT INTO skill_groups (title, icon) VALUES (?, ?)";
    db.query(query, [data.title, data.icon || "🔶"], (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
    getAllSkillGroups,
    createSkillGroup,
};