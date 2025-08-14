
// your gemini api key and gemini api url
const apiKey = "YOUR-GEMINI-API-KEY"
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


// handling closing and opening functionalities
document.getElementById("closeBtn").addEventListener("click", () => {
  document.querySelector(".chat-section").style.display = "none";
})

document.querySelector(".chat-btn").addEventListener("click", () => {
  document.querySelector(".chat-section").style.display = "block";
})


// handling the user input
document.querySelector("#sendBtn").addEventListener("click", renderOutput)
document.querySelector("#input-bar").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    renderOutput();
  }
});


// method to render user input and system output
async function renderOutput() {
  let userMessage = document.querySelector("#input-bar").value

  if (!userMessage.trim()) {
    return;
  }

  document.querySelector("#input-bar").value = "";
  document.querySelector(".chat").insertAdjacentHTML("beforeend", `
    <div>
      <div class="user">
        <p>${userMessage}</p>
      </div>
    </div>
    ` )

  const loadingElement = document.createElement("div");
  loadingElement.innerHTML = `
      <div class="loading-div">
        <div class="loader"></div>
      </div>
    `
  document.querySelector(".chat").appendChild(loadingElement);


  let chatContainer = document.querySelector(".chat");
  chatContainer.scrollTop = chatContainer.scrollHeight;

  let result = await callAPI(userMessage);

  document.querySelector(".chat").insertAdjacentHTML("beforeend", `
    <div>
      <div class="model">
        <p>${marked.parse(result)}</p>
      </div>
    </div>
    ` )

  loadingElement.remove();

  chatContainer.scrollTop = chatContainer.scrollHeight;
}


// method to generate gemini response
async function callAPI(userMessage) {
  const prompt = `You're a helpful assistant. Respond in a way that's concise, informative, and easy to understand.\n\n${userMessage}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
  } catch (error) {
    console.error("API Error:", error);
    return "⚠️ Error calling Gemini API.";
  }
}


