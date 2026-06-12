# AI Chatbot 

This is an AI chatbot MVP (like chatgpt, clause or gemini) which uses API of an open sourced model. This model can be self-hosted but requires extensive resources to run in regular computer so, I've used API instead. This AI uses llama 3.2 vision with 90B parameter in the backend. 

I did not used less resource demanding models because I would need more powerful AI later 
on in future. 

# Known issues 

The model takes slightly longer time to respond due to two main reason. The first reason being that API is used which delays the response and second is that a relatively high parameter model is used. To minimize this: I've reduced token limit for fast response.

Text conversations are stored in memory as array and forwarded in next chat conversation. If you initiate two different conversation with different context, the AI model might hallucinate (it did for me when I was doing image upload)

# Next Future Improvements

I would be adding several features like Dedicated database for storage, oauth for authentication / login, rate limitng to not overwhelm API usage and multi chat UI (similar to claue / gemini)

# Use of AI 

I have only used AI for debugging code and improving my own code which had some issues. I used claude for finding some flaws in integration of API properly. I mostly used AI for diagnosing issues and making sure my code works. If I had to guess a rough estimate, My AI use would be below (10-20)% on this project. 

# Note:

If you see "I can't help with that" or "Something went wrong" then do a quick refresh of site with F5.

If you upload two images, the previous image content and its details remain lost since API provider only accepts one image at a time. 

Theme toggle does not work

The top-right button in chatbot UI is not configured to anything.

aspect ratio only works for frontend grid (client side). If you download the image, you will get default square img