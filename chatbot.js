// In-browser semantic Q&A chatbot.
// Uses @huggingface/transformers (ONNX runtime) to run a small sentence-embedding
// model (Xenova/all-MiniLM-L6-v2) entirely client-side — no API key, no server.
import { pipeline, cos_sim } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0';

// ============================================================================
// Input preprocessing config
// ============================================================================

// The site owner's name(s) the bot may be addressed by. Add nicknames here.
// Matching is always case-insensitive; you don't need to add capitalized
// variants.
const OWNER_NAMES = ['mia'];

// Greeting words that may prefix a question ("hey, what do you do?").
const GREETING_WORDS = [
    'hi', 'hii', 'hiya', 'hello', 'helo', 'hey', 'heya', 'hai', 'yo',
    'howdy', 'greetings', 'sup', "what's up", 'whats up', 'wassup',
    'good morning', 'good afternoon', 'good evening', 'good day'
];

// Words that, when they appear immediately BEFORE the name, mean the name is
// the grammatical subject/object of the sentence rather than a form of
// address. "tell me about mia" and "who is mia" must NOT be stripped, or
// they'd collapse into "tell me about" / "who is" and lose all meaning.
const NAME_IS_SUBJECT_AFTER = [
    'about', 'is', 'was', 'are', 'know', 'meet', 'to', 'for', 'with',
    'and', 'call', 'called', 'named', 'name', 'like', 'of'
];

// ============================================================================
// Preprocessing — strips greetings/vocative name so they don't skew the
// embedding. Kept deliberately separate from the embedding/matching logic
// below so it can be unit-tested and tuned on its own.
//
// Why this exists: the embedding is a single vector for the WHOLE sentence,
// so "hey mia, what do you do?" lands in a different spot in vector space
// than "what do you do?" — enough to drop below the match threshold or land
// on the wrong intent. Removing pure-noise tokens before embedding fixes
// that without touching the substance of the question.
//
// Design rules:
//   - Only greetings and DIRECT-ADDRESS uses of the name are removed.
//   - The name is preserved when it's the subject/object ("who is mia").
//   - If stripping would leave nothing, the original is returned, so a bare
//     "hey mia" still matches the greeting intent.
// ============================================================================

/** Escape a string for safe use inside a RegExp. */
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Remove greeting words and vocative uses of the owner's name from a message.
 * @param {string} input Raw user message.
 * @returns {string} Cleaned message for embedding (never empty).
 */
function stripGreetingAndName(input) {
    if (!input || typeof input !== 'string') return '';

    const original = input.trim();
    let text = original;

    // Alternation groups, longest-first so "good morning" wins over "good".
    const names = OWNER_NAMES.slice().sort((a, b) => b.length - a.length)
        .map(escapeRegExp).join('|');
    const greets = GREETING_WORDS.slice().sort((a, b) => b.length - a.length)
        .map(escapeRegExp).join('|');
    const subjectCue = NAME_IS_SUBJECT_AFTER.map(escapeRegExp).join('|');

    // Separator: any run of whitespace/commas/exclamations/periods/dashes.
    const SEP = '[\\s,!.\\-–—]*';

    // 1) Leading greeting, with an optional name right after it.
    //    "hey mia, what do you do" / "hello! what's your role" / "yo mia"
    text = text.replace(
        new RegExp(`^(?:${greets})\\b${SEP}(?:(?:${names})\\b${SEP})?`, 'i'),
        ''
    );

    // 2) Leading bare name used as address: "mia, what do you do".
    //    Requires a following separator so we don't eat "mia's projects".
    text = text.replace(
        new RegExp(`^(?:${names})\\b${SEP}`, 'i'),
        ''
    );

    // 3) Name set off by commas mid-sentence: "so, mia, what do you do".
    text = text.replace(
        new RegExp(`,${SEP}(?:${names})\\b${SEP},`, 'gi'),
        ', '
    );

    // 4) Trailing vocative name: "what do you do, mia?" / "what do you do mia"
    //    We capture the word BEFORE the name and bail out if it's a
    //    subject/object cue, so "tell me about mia" and "who is mia" survive
    //    intact. Terminal punctuation is preserved.
    //    (A lookbehind won't work here: the separator is part of the match,
    //    so the lookbehind would be evaluated mid-cue-word.)
    text = text.replace(
        new RegExp(`(^|\\s)(\\S+)[\\s,]+(?:${names})\\b([!.?]*)\\s*$`, 'i'),
        (match, lead, prevWord, punct) => {
            const bare = prevWord.toLowerCase().replace(/[^a-z']/g, '');
            if (NAME_IS_SUBJECT_AFTER.includes(bare)) return match;
            // Drop a comma that was setting off the vocative ("...do, mia?")
            // so we don't leave a dangling "do,?".
            return `${lead}${prevWord.replace(/,+$/, '')}${punct}`;
        }
    );

    // 5) Tidy up leftover punctuation/whitespace from the removals.
    text = text
        .replace(/\s{2,}/g, ' ')
        .replace(/^[\s,!.\-–—]+/, '')
        .trim();

    // Guard: if we stripped the message down to nothing (or to bare
    // punctuation), the greeting WAS the message — return the original so it
    // can still match the greeting intent.
    if (!text || !/[a-z0-9]/i.test(text)) return original;

    return text;
}

// ============================================================================
// Third-person -> second-person normalization.
//
// Why this exists: every phrase in the intent bank is written in the second
// person ("where did YOU go to school"). When a visitor instead asks in the
// third person ("where did MIA go to school?"), the name survives the
// vocative stripping above — correctly, since it's the grammatical subject,
// not a form of address. But that leaves the only "mia" token in the query
// with just one phrase in the entire bank to attract it: "who is mia" in the
// bio intent. Result: every third-person question collapses onto the bio
// answer regardless of what was actually asked.
//
// Rewriting the name to "you"/"your" puts the query back in the same
// grammatical person as the bank, so it competes on the actual question.
// A small subject-verb agreement pass cleans up the artifacts this creates
// ("who is you" -> "who are you").
// ============================================================================

/**
 * Rewrite third-person references to the owner into second person.
 * @param {string} input Message (already greeting/vocative-stripped).
 * @returns {string} Message in second person.
 */
function normalizeToSecondPerson(input) {
    if (!input) return '';

    const names = OWNER_NAMES.slice().sort((a, b) => b.length - a.length)
        .map(escapeRegExp).join('|');

    let text = input;

    // Possessive first, so "Mia's" doesn't get half-rewritten by the rule
    // below. Straight and curly apostrophes both.
    text = text.replace(new RegExp(`\\b(?:${names})['’]s\\b`, 'gi'), 'your');

    // Remaining subject/object uses of the name.
    text = text.replace(new RegExp(`\\b(?:${names})\\b`, 'gi'), 'you');

    // Repair agreement broken by swapping a 3rd-person subject for "you".
    // ("what does you do" -> "what do you do", "who is you" -> "who are you")
    text = text
        .replace(/\bdoes you\b/gi, 'do you')
        .replace(/\bis you\b/gi, 'are you')
        .replace(/\bwas you\b/gi, 'were you')
        .replace(/\bhas you\b/gi, 'have you')
        .replace(/\byou is\b/gi, 'you are')
        .replace(/\byou was\b/gi, 'you were')
        .replace(/\byou has\b/gi, 'you have');

    return text.replace(/\s{2,}/g, ' ').trim();
}

/**
 * Full preprocessing pipeline applied to user input before embedding.
 * Kept as a thin composition so each stage stays independently testable.
 */
function preprocessQuestion(input) {
    return normalizeToSecondPerson(stripGreetingAndName(input));
}

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

        // Each intent can supply either a `phrases` array (preferred) or a
        // single `question` string. Every phrase is embedded SEPARATELY —
        // mean-pooling a long concatenation of phrasings would average them
        // into one blurry vector that matches nothing well.
        qaBank = [];
        for (const item of window.chatbotQA) {
            const phrases = item.phrases || [item.question];
            const vectors = [];
            for (const phrase of phrases) {
                vectors.push(await embed(phrase));
            }
            qaBank.push({ ...item, vectors });
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
    // Show the user exactly what they typed...
    addMessage(question, 'user');

    const thinking = addMessage('...', 'bot', false);

    try {
        // ...but embed the preprocessed version, so greetings, the vocative
        // name, and third-person phrasing don't shift the vector away from
        // the intended intent.
        const cleaned = preprocessQuestion(question);
        const questionVector = await embed(cleaned);

        // An intent scores as well as its single BEST-matching phrase (max,
        // not average) — one strong hit is what we care about, and averaging
        // would penalize intents that carry broad phrasing coverage.
        let best = null;
        let bestScore = -1;
        for (const item of qaBank) {
            for (const vector of item.vectors) {
                const score = cosineSimilarity(questionVector, vector);
                if (score > bestScore) {
                    bestScore = score;
                    best = item;
                }
            }
        }

        thinking.remove();

        // Raised from 0.35: with per-phrase embedding, real matches now score
        // much higher, so the old floor would let junk through. Tune here.
        const CONFIDENCE_THRESHOLD = 0.5;
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
