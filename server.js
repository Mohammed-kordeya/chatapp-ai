require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/chat", async (req, res) => {

    try {

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: "llama-3.3-70b-versatile",

                messages: [
                    {
                        role: "user",
                        content: req.body.message
                    }
                ]

            })

        });

        const data = await response.json();

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/", (req, res) => {
    res.send("ChatApp AI Server is running.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});
