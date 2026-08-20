const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 5000;

const db = require("./config/db");

const heroRouter = require("./routers/heroRouter");
const projectRouter = require("./routers/projectRouter");
const messageRouter = require("./routers/messageRouter");
const certificateRouter = require("./routers/certificateRouter");
const skillRouter = require("./routers/skillRouter");
const testimonialRouter = require("./routers/testimonialRouter");

app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json());

app.use(heroRouter);
app.use(projectRouter);
app.use(messageRouter);
app.use(certificateRouter);
app.use(skillRouter);
app.use(testimonialRouter);

app.get("/", (req,res) => {
    res.send("Selamat Datang di Backend Portofolio")
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http:localhost:${PORT}`);
});