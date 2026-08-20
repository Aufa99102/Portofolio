const express = require("express");
const router = express.Router();

router.get("/api/hero", (req,res) => {
    res.json({
        nama: "Aufa Safaraz Prianda",
        peran: "Fullstack Web Developer",
        deskripsi: "Saya adalah siswa XII RPL 1 yang sedang belajar dalam pembuatan aplikasi web dengan menggunakan Express.js"
    });
});

module.exports = router;