require("dotenv").config();
const express = require("express");
const path = require("path");
const systemprompt = require("./systemprompt");

const app = express();
app.use(express.json( { limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VIS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [{ role: "system", content: systemprompt },...messages],
        temperature: 1,
        top_p: 1,
        max_tokens: 4096,
        // reasoning_effort: "low", (I've used non reasoning model right now)
        stream: false,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
      }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));