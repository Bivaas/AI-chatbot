require("dotenv").config();
const express = require("express");
const path = require("path");
const systemprompt = require("./systemprompt");

const app = express();

// default 100kb limit is not enough for base64 for image conversion and then sending as json
app.use(express.json( { limit: "25mb" }));
app.use(express.static(path.join(__dirname, "public")));

// API setup from NVIDIA website (for chatbot)
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
        max_tokens: 4096, // def is around 16k but lowered for fast output
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


const updateImageCard = (imgIndex, imgUrl) => {
  const imgCard = document.getElementById(`img-card-${ingIndex}`)

  if(!imgCard) return;


  // loading animation to be replaced by the actual image
  imgCard.classList.remove("loading");
  imgCard.innerHTML = `<img src="${imgUrl}" class="result-img">

                            <div class="img-overlay">
                                <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                                    <i class="fa-solid fa-download"></i>
                                </a>
                            </div>`;
}

const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
  const { width, height } = getImageDimenstions(aspectRatio);
}

//API setup from NVIDIA (for image gen)
const imagePromises = Array.from({length: imageCount}, async(_, i) => {   // inside array of image generation promises
 
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://integrate.api.nvidia.com/v1/genai/${selectedModel}", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "${selectedModel}",
        // messages=[{"role":"user","content":""}]
      }),
    });

    if (!response.ok) throw new Error((await response.json())?.error);


    // for converting response to image URL and then updating the img card
    const result = await response.blob();
    updateImageCard(i, URL.createObjectURL(result));
  } catch(error) {
    console.log(error);
      }
});

  await Promise.allSettled(imagePromises);
})




app.listen(3000, () => console.log("Server running on http://localhost:3000"));