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
            message: "get data skills successed",
            data: results
        });
    });
};

const getSkillDetail = (req,res) => {
    const { id } = req.params;

    skillModel.getSkillById(id, (err, result) => {
        if (err) {
            return res.status(500).json ({
                success: false,
                message: "Failed to get skill detail",
                error: err.message,
            });
        }
        if (!result) {
            return res.status(404).json ({
                success: false,
                message: "Skill not found",
            });
        }
        res.json({
            success: true,
            message: "get skill detail successed",
            data: result
        });
    });
};

const createSkill = (req,res) => {
    const { skill_group_id, name, level, percentage } = req.body;

    if (!skill_group_id || !name || !level || !percentage) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    const skillData = {
        skill_group_id: Number(skill_group_id),
        name,
        level,
        percentage: Number(percentage) || 0,
    }

    skillModel.createSkill(skillData, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to create skill",
                error: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: result
        });
    });
};

const updateSkill = (req,res) => {
    const { id } = req.params;
    const { skill_group_id, name, level, percentage } = req.body;

    if (!skill_group_id || !name || !level || !percentage) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        })
    }

    skillModel.getSkillById(id, (err, existing) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get skill data",
                error: err.message,
            })
        }
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        const skillData = {
            skill_group_id: Number(skill_group_id),
            name,
            level,
            percentage: Number(percentage) || 0,
        };

        skillModel.updateSkill(id, skillData, (updateErr, result) => {
            if (updateErr) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update skill",
                    error: updateErr.message,
                });
            }

            res.json({
                success: true,
                message: "Skill updated successfully",
                data: {
                    id: Number(id),
                    ...skillData
                }
            })
        })
    })
}

const deleteSkill = (req,res) => {
    const { id } = req.params;

    skillModel.getSkillById(id, (err, existing) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get skill data",
                error: err.message,
            });
        }
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            })
        }

        skillModel.deleteSkill(id, (deleteErr, result) => {
            if (deleteErr) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete skill",
                    error: deleteErr.message,
                })
            }

            res.json({
                success: true,
                message: "Skill deleted successfully",
            })
        })
    })
}

const getSkillGroup = (req,res) => {
    skillModel.getAllSkillGroups((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to get skill groups",
                error: err.message,
            });
        }

        res.json({
            success: true,
            message: "Skill groups retrieved successfully",
            data: results
        });
    });
}

const createSkillGroup = (req,res) => {
    const { title, icon } = req.body;
    if (!title) {
        return res.status(400).json ({
            success: false,
            message: "Title is required"
        })
    }

    skillModel.createSkillGroup({ title, icon }, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to create skill group",
                error: err.message,
            });
        }

        res.status(201).json({
            success: true,
            message: "Skill group created successfully",
            data: {
                id: result.insertId,
                title,
                icon: icon || "🔶"
            }
        });
    });
}

module.exports = {
    getSkills,
    getSkillDetail,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillGroup,
    createSkillGroup
}