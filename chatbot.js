// In-browser semantic Q&A chatbot.
// Uses @huggingface/transformers (ONNX runtime) to run a small sentence-embedding
// model (Xenova/all-MiniLM-L6-v2) entirely client-side — no API key, no server.
import { pipeline, cos_sim } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

const chatLog = document.getElementById('chatLog');
const chatStatus = document.getElementById('chatStatus');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatSubmit = document.getElementById('chatSubmit');

let extractor = null;
let qaBank = [];

const HISTORY_KEY = 'chatbot_history';

function saveMessage(text, sender) {
    const history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
    history.push({ text, sender });
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addMessage(text, sender, persist = true) {
    const msg = document.createElement('div');
    msg.classList.add('chat-message', sender);
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
    if (persist) saveMessage(text, sender);
    return msg;
}

function restoreHistory() {
    const history = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
    for (const { text, sender } of history) {
        addMessage(text, sender, false);
    }
    return history.length > 0;
}

function cosineSimilarity(a, b) {
    if (typeof cos_sim === 'function') return cos_sim(a, b);
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function embed(text) {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

async function init() {
    if (typeof window.chatbotQA === 'undefined') {
        chatStatus.textContent = 'chatbot unavailable (content not loaded)';
        return;
    }

    try {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

        qaBank = [];
        for (const item of window.chatbotQA) {
            const vector = await embed(item.question);
            qaBank.push({ ...item, vector });
        }

        chatStatus.parentElement.remove();
        const hadHistory = restoreHistory();
        if (!hadHistory) {
            addMessage("ask me about my background, skills, or projects.", 'bot');
        }
        chatInput.disabled = false;
        chatSubmit.disabled = false;
        chatInput.focus();
    } catch (err) {
        chatStatus.textContent = 'could not load the model (check your connection)';
        console.error('Chatbot init failed:', err);
    }
}

async function handleQuestion(question) {
    addMessage(question, 'user');

    const thinking = addMessage('...', 'bot', false);

    try {
        const questionVector = await embed(question);

        let best = null;
        let bestScore = -1;
        for (const item of qaBank) {
            const score = cosineSimilarity(questionVector, item.vector);
            if (score > bestScore) {
                bestScore = score;
                best = item;
            }
        }

        thinking.remove();

        const CONFIDENCE_THRESHOLD = 0.35;
        if (best && bestScore >= CONFIDENCE_THRESHOLD) {
            addMessage(best.answer, 'bot');
        } else {
            addMessage("I'm not sure about that one. Try asking another question.", 'bot');
        }
    } catch (err) {
        thinking.remove();
        addMessage('something went wrong answering that. try again?', 'bot');
        console.error('Chatbot query failed:', err);
    }
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = '';
    handleQuestion(question);
});

init();
