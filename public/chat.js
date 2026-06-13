const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");


const API_URL = "/api/chat";
const conversation = []

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}

const createMessageElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}


// to show the messages to user frontend frm history which should store chat data and should be attached to user id
const loadHistory = async () => { 
    try { 
        const response = await fetch("/api/history");

        if (!response.ok) return;

        const data = await response.json();


        data.history.forEach((record) => {

            // since every message is stored in array for memory, last one is user's text 
            const lastUserMsg = record.messages[record.messages.length - 1];
            const userText = typeof lastUserMsg.content === "string" 

                ? lastUserMsg.content
                : lastUserMsg.content.find(p => p.type === "text")?.text || "";


            // rebuild of old user messages history
            const userDiv = createMessageElement(`<div class="message-text"></div>`, "user-message");

            userDiv.querySelector(".message-text").textContent = userText;

            chatBody.appendChild(userDiv);


            // rebuild of old bot messages history
            const botDiv = createMessageElement(`<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg><div class="message-text"></div>`, "bot-message");

            botDiv.querySelector(".message-text").innerHTML = marked.parse(record.reply);

            chatBody.appendChild(botDiv);
        });
  
    }

    catch (error) { 
        console.error(error)
    }
};

    loadHistory();


// outgoing user mesages
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message) return;
    conversation.push({
        role: "user",
        content: userData.file.data
            ? [
                { type: "text", text: userData.message },
                { type: "image_url", image_url: { url: `data:${userData.file.mime_type};base64,${userData.file.data}`}}
              ]
            : userData.message
    });
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");

    const messageContent = `<div class="message-text"></div>
            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;


    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

    // delay for generate bot response and animation to be late. first generate bot response starts and then after delay this starts later. NOTE: if timeout value changes, the chat breaks. !!!
    setTimeout(() => {
        const botMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>    

                <div class="message-text">
                   <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                   </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message");
        incomingMessageDiv.classList.add("thinking"); 
        chatBody.appendChild(incomingMessageDiv); 
        chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

        generateBotResponse(incomingMessageDiv);
    }, 600);
    
    // llama 3.2 rejects more than one img at a time so previous images in memory should be removed
    const stripOldImages = () => {
        let lastImageIndex = -1;
        for (let i = 0; i < conversation.length; i++) {
            if (Array.isArray(conversation[i].content)) lastImageIndex = i;
        }

        for (let i = 0; i < conversation.length; i++) {
            
              if (Array.isArray(conversation[i].content) && i !== lastImageIndex) {
                const textPart = conversation[i].content.find(p => p.type === "text");
                conversation[i].content = textPart ? textPart.text : "";
            }
        }
    };

    const generateBotResponse = async (incomingMessageDiv) => {
        const messageTextElement = incomingMessageDiv.querySelector(".message-text");

        try {

            stripOldImages();

            // OpenAI compatible endpoint into nvidia website and also system prompt is attached
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ messages: conversation }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error("request failed !");
            messageTextElement.innerHTML = marked.parse(data.reply);
            conversation.push({ role: "assistant", content: data.reply});

            } catch (error) {
                console.error(error);
                messageTextElement.textContent = "Something went wrong";

            } finally {
             // remove user file data after message sent
                userData.file = {};  
                incomingMessageDiv.classList.remove("thinking");
                chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
            }

        }
    }


messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
        if(e.key === "Enter" && userMessage) {
            handleOutgoingMessage(e);
        }
});



// input change and preview of file selected
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

        userData.file = {
            data: base64String, 
            mime_type: file.type
        }

        fileInput.value = "";
    }

    reader.readAsDataURL(file);
})


// fileupload cancel 
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});



// emoji picker and input to my cursor with setRangetext
const picker = new EmojiMart.Picker( {
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",

    onEmojiSelect: (emoji) => {
        const {selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },

    onClickOutside: (e) => { 
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } 
        else { 
            document.body.classList.remove("show-emoji-picker");
        }
    }

} );


document.querySelector(".chat-form").appendChild(picker);

// send message eventlistener
sendMessageButton.addEventListener("click", handleOutgoingMessage);

// fileupload eventlistener
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
