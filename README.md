# AI Chatbot 

This is an AI chatbot (like chatgpt, clause or gemini) which uses API of an open sourced model. This model can be self-hosted but requires extensive resources to run in regular computer so, I've used API instead. This AI uses llama 3.2 vision with 90B parameter in the backend. 

I did not used less resource demanding models because I would need more powerful AI later 
on in future. 

# Known issues 

The model takes slightly longer time to respond due to two main reason. The first reason being that API is used which delays the response and second is that a relatively high parameter model is used. To minimize this: I've reduced token limit fast response.

Text conversations are stored in memory as array and forwarded in next chat. If you initiate two different conversation with different context, the AI model might hallucinate (it did for me when I was doing multi-image upload)

# Next Future Improvements

I would be adding several features like Dedicated database for storage, oauth for authentication / login, rate limitng to not overwhelm API usage, image generation through open-source AI model and multi chat UI (similar to chatgpt)

# Use of AI 

I have only used AI for debugging code and improving my own code which had some issues. I used claude for finding some flaws in integration of API properly. I mostly used AI for diagnosing issues and making sure my code works. If I had to guess a rough estimate, My AI use would be below (10-20)% on this project. 