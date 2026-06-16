# AI Chatbot 

This is an AI chatbot (like chatgpt, clause or gemini) where I have used API of an open sourced model. This AI uses llama 3.2 vision with 90B parameter in the backend for chatbot. For image generation, I've FLUX.1 DEV and SCHNELL model.

I did not used less resource demanding models because I would need more powerful AI later in future for better response. 

# Known issues 

The model takes slightly longer time to respond due to two main reason. The first reason being that API is used which delays the response and second is that a relatively high parameter model is used. To minimize this: I've reduced token limit for fast response.

Text conversations are stored in memory as array and forwarded in next chat conversation. If you initiate two different conversation with different context, the AI model might hallucinate (it did for me when I was doing image upload). Also, if you do conversation for too long in same chat session, the context memory gets too much and might cause issue. (I recommend pressing F5)

# what I've used 

Express for server side backend functions deployed as serverless function in vercel
clerk for authentication 
MongoDB for database
upstash redis for rate limiting 
serper for real-time web-search ( toggled through web-search button in message-input field )

# Use of AI 

I have only used AI for debugging code and improving my own code which had some issues. I used claude for finding some flaws in integration of API properly. I mostly used AI for diagnosing issues and making sure my code works properly.

# Note:

If you see "I can't help with that" or "Something went wrong" then do a quick refresh of site with F5.

Going back or pressing F5 resets memory / context

The top-right button in chatbot UI is not configured to anything.

aspect ratio only works for frontend grid (client side). If you download the image, you will get default square img

# Assets

```
icon library: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css
another icon library: https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded
marked js (md to html for AI response): https://cdn.jsdelivr.net/npm/marked/marked.min.js
Emoji Mart: https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js
```

