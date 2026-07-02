import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// للتأكد أن Railway قرأ المفتاح
console.log("Groq key exists:", !!GROQ_API_KEY);

// اختبار السيرفر
app.get("/", (req, res) => {
    res.send("Server is working 🚀");
});

// AI Chat
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        if (!GROQ_API_KEY) {
            return res.status(500).json({
                error: "Groq API Key not found"
            });
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    messages: [
                        {
                            role: "system",
                            content: "أنت مساعد ذكاء اصطناعي ذكي ومفيد. أجب بنفس لغة المستخدم. إذا كانت الرسالة بالعربية فأجب بالعربية بشكل طبيعي، وإذا كانت بالإنجليزية فأجب بالإنجليزية."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Error:", data);

            return res.status(response.status).json({
                error: data.error?.message || "Groq API Error"
            });
        }

        return res.json({
            reply: data.choices[0].message.content
        });

    } catch (err) {
        console.error("Server Error:", err);

        return res.status(500).json({
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("Groq Key Found:", !!GROQ_API_KEY);
});
