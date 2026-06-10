const promptInput = document.querySelector(".prompt-input");

const promptForm = document.querySelector(".prompt-form");

const promptBtn = document.querySelector(".prompt-btn");

const modelSelect = document.querySelector(".model-select");

const countSelect = document.querySelector(".count-select");

const ratioSelect = document.querySelector(".ratio-select");



const examplePrompts = [ 
    
"a quick brown box jumps over a lazy road",
"apple a day keeps the doctor away"
//some example prompts collection to be added


];


const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1"
    const promptText = promptInput.value.trim();

    
}

// eventlistener to fill prompt with random pre-selected prompt from above
promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
})

promptForm.addEventListener("submit", handleFormSubmit);