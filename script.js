// 1. Initialize Animations
AOS.init({ once: true });

// 2. Consultation Modal Logic
function openConsultation() {
    const modal = document.getElementById('consultationModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeConsultation() {
    const modal = document.getElementById('consultationModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; 
}

// 3. Market Pulse Logic (May 2026 Data)
function updateMarketData() {
    if(document.getElementById('sensex-price')) {
        document.getElementById('sensex-price').innerText = "77,295.08";
        document.getElementById('tech-index').innerText = "24,153.90";
        document.getElementById('gold-price').innerText = "₹1,49,841";
    }
}
window.onload = updateMarketData;

function getMarketInfo(type) {
    let info = "";
    if(type === 'Gold') info = "Gold is trading at ₹1,49,841 per 10g. Market correction today suggests a strategic hedge opportunity.";
    else if(type === 'Sensex') info = "Sensex is at 77,295.08. Positive sentiment driven by crude oil stabilization.";
    else if(type === 'Tech') info = "Tech Index at 24,153.90. Growth in Indian SaaS ecosystem remains resilient.";
    
    toggleBot(); 
    const messages = document.getElementById('bot-messages');
    messages.innerHTML += `<div style="background:white; padding:15px; border-radius:10px; border-left:4px solid #FFC20E; margin-bottom:10px;"><strong>Intelligence:</strong><br>${info}</div>`;
    messages.scrollTop = messages.scrollHeight;
}

// 4. Chatbot Logic
let conversationHistory = [];
function toggleBot() {
    const win = document.getElementById('bot-window');
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
}

async function handleBotSend() {
    const input = document.getElementById('botInput');
    const messages = document.getElementById('bot-messages');
    const text = input.value.trim();
    if(!text) return;

    messages.innerHTML += `<div style="background:#FFC20E; align-self:flex-end; padding:10px; border-radius:10px; font-weight:700;">${text}</div>`;
    conversationHistory.push({ role: "user", content: text });
    input.value = "";
    messages.scrollTop = messages.scrollHeight;

    try {
        const res = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ history: conversationHistory }) 
        });
        const data = await res.json();
        messages.innerHTML += `<div style="background:white; align-self:flex-start; padding:10px; border-radius:10px; border:1px solid #eee;">${data.reply}</div>`;
        conversationHistory.push({ role: "assistant", content: data.reply });
    } catch (e) {
        messages.innerHTML += `<div style="color:red; font-size:0.8rem;">AI Offline. Start server.js.</div>`;
    }
    messages.scrollTop = messages.scrollHeight;
}

document.getElementById('botInput').addEventListener("keypress", (e) => { if(e.key === "Enter") handleBotSend(); });