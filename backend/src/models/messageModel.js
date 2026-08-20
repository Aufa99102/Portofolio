const db = require("../config/db");

const createMessage = (data, callback) => {
    const query = "INSERT INTO contacts (nama, email, subject, message) VALUES (?, ?, ?, ?)";
    db.query(query, [data.nama, data.email, data.subject, data.message], (err, results) => {
        callback(err, results);
    });
};

const getAllMessage = (callback) => {
    const query = "SELECT * FROM contacts ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    createMessage,
    getAllMessage
}