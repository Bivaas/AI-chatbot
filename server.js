
require("dotenv").config();

const { MongoClient } = require("mongodb");


let cachedDb = null; 

async function getDb() {

  if (cachedDb) return cachedDb;

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  cachedDb = client.db();

  return cachedDb;
}

const { clerkMiddleware, getAuth } = require("@clerk/express");
const express = require("express");
const path = require("path");
const systemprompt = require("./systemprompt");

const app = express();

// default 100kb limit is not enough for base64 for image conversion and then sending as json
app.use(express.json( { limit: "25mb" }));

app.use(clerkMiddleware());

app.use(express.static(path.join(__dirname, "public")));



// routing to have clean URL in chatbot page and image page and login page
app.get("/image", (req, res) => {

  res.sendFile(path.join(__dirname, "public", "image.html"));
});


app.get("/", (req,res) => {

  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/login", (req,res) => {

  res.sendFile(path.join(__dirname, "public", "login.html"));
});


// route to fetch chat messages from stored text field in UI messages by oldest first sorting for given specific user id 
app.get("/api/history", async (req, res) => {
  const {userId} = getAuth(req);

  if (!userId) return res.status(401).json({ error: "Not signed in"});

  try { 
    
    const db = await getDb();
    const history = await db.collection("chats")

      .find({ userId: userId })
      .sort({ createdAt: 1 })
      .toArray();

      res.json({ history });

  }

  catch (err) { 
    res.status(500).json({ error: "Could not load history" });
  } 
});


// getting each model their own API keys since NVIDIA does not provide single account based APIKEY. This matches to what usr selects and that specific model URL and then API key is selected.
const IMAGE_KEYS = {

  "black-forest-labs/flux.1-dev": process.env.FLUXDEV_API_KEY,
  "black-forest-labs/flux.1-schnell": process.env.FLUXSCHNELL_API_KEY,
  "stabilityai/stable-diffusion-3.5-large": process.env.STABLE_API_KEY, // no longer used cause endpoint does not work
};


// API setup from NVIDIA website (for CHATBOT)

app.post("/api/chat", async (req, res) => {


  const { userId } = getAuth(req);

  if (!userId) return res.status(401).json({error: "Not signed in"});

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
        max_tokens: 8192, // def is around 16k but lowered for fast output
        // reasoning_effort: "low", (I've used non reasoning model right now)
        stream: false,
      }),
    });


    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });


    const db = await getDb();

    await db.collection("chats").insertOne ( { 
      userId: userId, 
      messages: messages,
      reply: data.choices[0].message.content,
    })


    res.json({ reply: data.choices[0].message.content });
  } catch (err) {

        res.status(500).json({ error: "Something went wrong" });
      }
});



//API setup from NVIDIA (for IMAGE GEN)
 
app.post("/api/generate-image", async (req, res) => {

  const { userId } = getAuth(req);

  if (!userId) return res.status(401).json({ error: "Sign in first !"});
  try {
    const { model, prompt } = req.body;

    // from above, taking keys for selected specific model
    const apiKey = IMAGE_KEYS[model];


    // since SD uses aspect ratio format and flux uses sample and height / width. So, simple gate on model name us used to determine those params
    let payload;

        
        payload = {
          prompt: prompt,
          samples: 1,
          width: 1024,
          height: 1024,
          steps: model === "black-forest-labs/flux.1-schnell" ? 4 : 25,
          seed: 0,
          
        };


      const response = await fetch(`https://ai.api.nvidia.com/v1/genai/${model}`, {
        method: "POST",
        headers: { 

          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },

        body: JSON.stringify(payload),  
      });
    

   if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA returned ${response.status}: ${errorText.slice(0, 200)}`);  
    }

  // for converting response to image URL and then updating the img card
   const data = await response.json();

   

  // since flux returns artifacts and not data-URL prefix and stable diffusion returns { image } which already includes prefix so the output is handled this way
   let imageData;

   if (data.artifacts && data.artifacts[0]) {

    imageData = `data:image/jpeg;base64,${data.artifacts[0].base64}`;
   } else if (data.image) {

    imageData = data.image.startsWith("data:")

      ? data.image
      : `data:image/jpeg;base64,${data.image}`;
   }
   
   else {

    throw new Error("unexpected image response format");

   }
  
   res.json({ imageBase64: imageData});


  } catch (error) {

    res.status(500).json({ error: error.message });
  }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));