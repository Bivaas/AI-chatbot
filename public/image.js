const promptInput = document.querySelector(".prompt-input");

const promptForm = document.querySelector(".prompt-form");

const promptBtn = document.querySelector(".prompt-btn");

const modelSelect = document.querySelector("#model-select");

const countSelect = document.querySelector("#count-select");

const ratioSelect = document.querySelector("#ratio-select");

const gridGallery = document.querySelector(".gallery-grid");

const examplePrompts = [ 
"A quick brown box jumps over a lazy dog",
"An apple a day keeps the doctor away"
//some example prompts collection to be added later on
];

const updateImageCard = (imgIndex, imgUrl) => {
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if (!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = `
        <img src="${imgUrl}" class="result-img">
        <div class="img-overlay">
            <a href="${imgUrl}" class="img-download-btn" download="AI_Image_${Date.now()}.png">
                <i class="fa-solid fa-download"></i>
            </a>
         </div>
         `;
};

const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    // array for making the request of image count correct
    const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
        try { 
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ model: selectedModel, prompt: promptText}),
            });

            if (!response.ok) throw new Error("Could not fetch image");

            const data = await response.json();
            updateImageCard(i, data.imageBase64);
        }
        catch(error) {
            console.error(error);
            const imgCard = document.getElementById(`img-card-${i}`);

            // for red triangle and UI ball animation to be started dynamically
            if (imgCard) {
                imgCard.classList.remove("loading");
                imgCard.classList.add("error");
            }
        }
    });

    await Promise.allSettled(imagePromises);
};


// For placeholder cards and their classification too
const createImageCards = (selectModel, imageCount, aspectRatio, promptText) => {

    gridGallery.innerHTML = "";

    for (let i = 0; i < imageCount; i++) {
        gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}"   >

                            <div class="status-container">

                                <div class="spinner"> </div>

                                    <i class="fa-solid fa-triangle-exclamation"></i>

                                    <p class="status-text">
                                        Generating
                                    </p>
                                
                                            <!-- HTML section for UIball loading animation -->                                       
                                            <div class="uib-loader">
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            <div class="dot"></div>
                                            </div>
                                    
                                </div>
                            </div>`;

    }

    generateImages(selectModel, imageCount, aspectRatio, promptText);
}

// form data / values and their submission handle: 
const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1"
    const promptText = promptInput.value.trim();

    createImageCards(selectedModel, imageCount, aspectRatio, promptText);
}

// eventlistener to fill prompt with random pre-selected prompt from above
promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
})

promptForm.addEventListener("submit", handleFormSubmit);