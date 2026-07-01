import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});

app.post("/chat", (req, res) => {
    const message = req.body.message;

    return res.json({
        reply: "أنت قلت: " + message
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on", PORT);
});
