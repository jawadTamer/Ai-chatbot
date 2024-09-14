let typingForm = document.querySelector(".typing-form");
let chatList =document.querySelector(".chat-list");


const API_KEY = "AIzaSyD8toS004QpJ1ufsF0Gj2Umog-6Dqg41d0"; 
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

let showTypingEffect = (text,textElement) =>{
let words =text.split("")
let currentWordIndex =0;

let typingInterval = setInterval(() =>{
textElement.innerText += (currentWordIndex === 0? "":"") + words[currentWordIndex++]
if (currentWordIndex === words.length) {
 clearInterval(typingInterval) 
}
window,scrollTo(0,chatList.scrollHeight)
},40);
}



let generateApiResponse = async(div)=>{
let textElement =div.querySelector(".text");
try {
  let response = await fetch(API_URL ,{
    method:"post",
    headers:{"content-Type":"application/json"},
    body:JSON.stringify({
      contents:[{
        role:"user",
        parts:[{text:userMessage}]
      }]
    })
  })
let data =await response.json();  
let apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1')
console.log(apiResponse);

showTypingEffect(apiResponse,textElement)
textElement.innerHTML=apiResponse
} catch (error) {
  console.error
}
finally{
  div.classList.remove("loading")
}
}


let copyMessage =(copy_btn) =>{
let messageText = copy_btn.parentElement.querySelector(".text").innerText
navigator.clipboard.writeText(messageText)
copy_btn.innerText ="done"
setTimeout(()=>copy_btn.innerText="content_copy",1000)
}


let showLoading =()=>{
  let html=`
            <div class="message-content">
              <img src="images/gemini.svg" alt="">
            <p class="text"></p>
            <div class="loading-indicator">
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
              <div class="loading-bar"></div>
            </div>
          </div>
          <span onClick="copyMessage(this)" class="material-symbols-outlined">
            content_copy
            </span> 
  `
  const div = document.createElement("div");
  div.classList.add("message", "incoming","loading");
  div.innerHTML=html;
  chatList.appendChild(div);
window,scrollTo(0,chatList.scrollHeight)

  generateApiResponse(div);
}

let handelOutGoingChat = () => {
  userMessage = document.querySelector(".typing-input").value;
  if (!userMessage) return;
  let html = `
            <div class="message-content">
              <img src="images/speaker-1.png" alt="">
            <p class="text"></p>
          </div>`;
  const div = document.createElement("div");
  div.classList.add("message", "outgoing");
  div.innerHTML=html;
  div.querySelector(".text").innerHTML=userMessage;
  chatList.appendChild(div);

  typingForm.reset();
window,scrollTo(0,chatList.scrollHeight)

setTimeout(showLoading ,10)
};

typingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handelOutGoingChat();
});
