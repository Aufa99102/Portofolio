const db = require("../config/db");

const getAllCetificates = (callback) => {
    const query = "SELECT * FROM certificates ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    getAllCetificates,
}