const db = require("../config/db");

const getAllCertificates = (callback) => {
    const query = "SELECT * FROM certificates ORDER BY created_at DESC";
    db.query(query, (err, results) => {
        callback(err, results);
    });
};

const getCertificateById = (id, callback) => {
    const query = "SELECT * FROM certificates WHERE id = ?";
    db.query(query, [id], (err, results) => {
        callback(err, results ? results[0] : null);
    });
};

const createCertificate = (data, callback) => {
    const query = "INSERT INTO certificates (title, issuer, date, credential_id, verification_url) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [data.title, data.issuer, data.date, data.credential_id, data.verification_url], (err, results) => {
        callback(err, results);
    });
};

const updateCertificate = (id, data, callback) => {
    const query = "UPDATE certificates SET title = ?, issuer = ?, date = ?, credential_id = ?, verification_url = ? WHERE id = ?";
    db.query(query, [data.title, data.issuer, data.date, data.credential_id, data.verification_url, id], (err, results) => {
        callback(err, results);
    });
};

const deleteCertificate = (id, callback) => {
    const query = "DELETE FROM certificates WHERE id = ?";
    db.query(query, [id], (err, results) => {
        callback(err, results);
    });
};

module.exports = {
    getAllCertificates,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
};