require("dotenv").config();
const express = require("express");
const path = require("path");
const systemprompt = require("./systemprompt");

const app = express();


// getting each model their own API keys since NVIDIA does not provide single account based APIKEY. This matches to what usr selects and that specific model URL and then API key is selected.
const IMAGE_KEYS = {
  "black-forest-labs/flux.1-dev": process.env.FLUXDEV_API_KEY,
  "black-forest-labs/flux.1-schnell": process.env.FLUXSCHNELL_API_KEY,
  "stabilityai/stable-diffusion-3.5-large": process.env.STABLE_API_KEY,
};

// default 100kb limit is not enough for base64 for image conversion and then sending as json
app.use(express.json( { limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));


// API setup from NVIDIA website (for CHATBOT)

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VIS_API_KEY}`,  // by VIS, I meant vision + text hybrid model
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-90b-vision-instruct",
        messages: [{ role: "system", content: systemprompt },...messages],
        temperature: 1,
        top_p: 1,
        max_tokens: 6144, // def is around 16k but lowered for fast output
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



//API setup from NVIDIA (for IMAGE GEN)
 
app.post("/api/generate-image", async (req, res) => {
  try {
    const { model, prompt } = req.body;

    // from above, taking keys for selected specific model
    const apiKey = IMAGE_KEYS[model];

    const response = await fetch(`https://ai.api.nvidia.com/v1/genai/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ 
        prompt: prompt,
        mode: "base",
        cfg_scale: 3.5,
        width: 1024,
        height: 1024,
        seed: 0,
        steps: 50,

       }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate image.");
    }

    // for converting response to image URL and then updating the img card
    const data = await response.json();


   const base64Image = data.artifacts[0].base64;         

    // Sending img back to the client as JSON
    res.json({ imageBase64: `data:image/jpeg;base64,${base64Image}` });        

    // res.json({ imageBase64: data.image });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(3000, () => console.log("Server running on http://localhost:3000"));