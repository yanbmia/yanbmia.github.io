// ============================================================================
// Intent bank for the embedding-based chatbot (see chatbot.js)
// ============================================================================
// Each entry is one intent:
//   phrases[]   — ways someone might ask about this topic. Each phrase is
//                 embedded SEPARATELY and the intent scores as well as its
//                 single best-matching phrase. So more phrasings = strictly
//                 better coverage, with no dilution penalty.
//   answer      — the canned response.
//   followUps[] — (optional) 2-3 natural-language questions shown as
//                 clickable suggestion chips after this answer. These are
//                 plain text, not references/IDs — clicking one just feeds
//                 the text back through the normal matching pipeline, same
//                 as if the visitor typed it. Keep them close to (or copied
//                 from) an existing phrase elsewhere in this file so they're
//                 guaranteed to match their intended target with high
//                 confidence. If omitted, chatbot.js falls back to the
//                 global STARTER_QUESTIONS.
//
// Adding coverage: append strings to `phrases`. Adding a topic: add a new
// object. No other code changes needed.
//
// Keep phrases SHORT and varied (formal, casual, shorthand, typos, and
// statements as well as questions). Avoid making two intents' phrases
// near-identical — see the "disambiguation" notes inline.
// ============================================================================

window.chatbotQA = [

    // ---------------------------------------------------------------- intro
    {
        phrases: [
            "hi", "hello", "hey", "yo", "hey there", "what's up",
            "who are you", "who is this", "introduce yourself",
            "what is this", "who am i talking to"
        ],
        answer: "Hi! I'm Mia. Ask me about my background, projects, skills, or how to get in touch.",
        followUps: [
            "what do you do?",
            "what projects have you built?",
            "how do I contact you?"
        ]
    },

    // ------------------------------------------------------------ work / job
    // DISAMBIGUATION: this intent = what the work IS (the substance).
    // The "where do you work" intent below = employer/location only.
    {
        phrases: [
            "what do you do",
            "what's your current role",
            "what is your job",
            "what do u do for work",
            "what do you do for a living",
            "describe your job",
            "what's your day job",
            "what do you do at work",
            "tell me about your work",
            "what kind of work do you do",
            "what are your responsibilities",
            "what does your job involve",
            "whats ur job",
            "current position",
            "what's your title"
        ],
        answer: "I'm helping lead Con Edison's $150M+ enterprise AI migration, which includes coordinating 25 data products across 7 business domains onto Google Cloud Platform, and bridging engineering and business teams to turn technical tradeoffs into clear decisions.",
        followUps: [
            "what are your skills?",
            "explain your problem solving process",
        ]
    },
    {
        phrases: [
            "where do you work",
            "who do you work for",
            "what company are you at",
            "where are you employed",
            "who's your employer",
            "what company do u work at",
            "are you working right now",
            "where do u work"
        ],
        answer: "Currently at ConEdison in the Enterprise Data and AI team!",
        followUps: [
            "what do you do?",
            "what are you passionate about?"
        ]
    },

    // ------------------------------------------------------------- education
    // DISAMBIGUATION: three education intents, kept distinct by intent verb —
    // WHAT you studied / WHY you studied it / WHICH classes. Phrases below
    // deliberately avoid overlapping on those trigger words.
    {
        phrases: [
            "what did you study",
            "what's your degree",
            "what was your major",
            "where did you go to college",
            "what school did you go to",
            "did you go to university",
            "what's your educational background",
            "what did u major in",
            "where did you go to school",
            "what university did you attend",
            "tell me about your degree",
            "college major"
        ],
        answer: "I studied Computational Social Science at NYU. Think of it as a mix between data science and sociology. My primary interest was on using data and code to understand behavior on an individual and societal level.",
        followUps: [
            "why did you choose that major?",
            "what classes did you take?"
        ]
    },
    {
        phrases: [
            "why did you study that",
            "why did you choose that major",
            "why computational social science",
            "why css",
            "what drew you to your major",
            "how did you pick your major",
            "what made you choose that field",
            "why that degree",
            "reason for choosing your major"
        ],
        answer: "I was drawn to CSS because it allowed me to combine my interests in data, coding, and understanding human behavior. I wanted a major that would give me the technical skills to analyze data while also providing a strong foundation in social science to understand the context and implications of that data.",
        followUps: [
            "what classes did you take?",
            "what are your career goals?"
        ]
    },
    {
        phrases: [
            "what classes did you take",
            "what was your coursework",
            "what courses did you take",
            "relevant coursework",
            "what did you learn in school",
            "what classes are relevant",
            "list your courses",
            "what did you take in college"
        ],
        answer: "Some courses I took are: Data Structures & Algorithms, Computer Systems Organization, Interactive Computing, Decision Models, Data Science for Business, Statistics for Social Research, Critical Data Studies, and AI Ethics.",
        followUps: [
            "what are your data skills?",
            "what are your dev skills?"
        ]
    },
    {
        phrases: [
            "where did you go to high school",
            "what high school did you go to",
            "did you go to stuyvesant",
            "high school"
        ],
        answer: "Stuyvesant High School, here in NYC.",
        followUps: [
            "what did you study?",
            "where are you from?"
        ]
    },

    // -------------------------------------------------------------- personal
    // DISAMBIGUATION: "where are you from" (origin) vs "tell me about
    // yourself" (broad bio) vs "hobbies" (activities). Previously these
    // collided; phrases are now scoped tightly to each.
    {
        phrases: [
            "where are you from",
            "where did you grow up",
            "what's your hometown",
            "where were you born",
            "where u from",
            "are you from new york",
            "what city are you from"
        ],
        answer: "Brooklyn, New York!",
        followUps: [
            "tell me about yourself",
            "what are your hobbies?"
        ]
    },
    {
        phrases: [
            "tell me about yourself",
            "what's your background",
            "give me your bio",
            "describe yourself",
            "who is mia",
            "tell me abt urself",
            "a bit about you",
            "your story",
            "background info"
        ],
        answer: "I'm first-gen American. My mom is from Trinidad, and my dad is from China. I have a passion for weightlifting, photography, and hiking. ",
        followUps: [
            "describe your job?",
            "what did you study",
            "what are you passionate about?"
        ]
    },
    {
        phrases: [
            "what are your hobbies",
            "what do you do for fun",
            "what do you do outside of work",
            "any hobbies",
            "what are you into",
            "how do you spend your free time",
            "interests outside work",
            "what do u do for fun"
        ],
        answer: "Weightlifting, photography, and hiking. Last place I hiked was Mount Rainier!",
        followUps: [
            "tell me something interesting about you",
            "tell me about the photos"
        ]
    },
    {
        phrases: [
            "tell me something interesting about you",
            "random fact",
            "fun fact",
            "something unique about you",
            "surprise me",
            "tell me a fun fact"
        ],
        answer: "I've been reading the New York Times (almost) every day since junior year of high school.",
        followUps: [
            "tell me about yourself",
            "what are your strengths?"
        ]
    },

    // ---------------------------------------------------------------- skills
    // DISAMBIGUATION: data vs dev vs tools. The generic "what are your
    // skills" now lives in its own catch-all intent that names all three,
    // so it stops stealing matches from the specific ones.
    {
        phrases: [
            "what are your skills",
            "what are you good at",
            "what's your skillset",
            "what can you do",
            "list your skills",
            "technical skills",
            "what are ur skills"
        ],
        answer: "On the data side: Python, SQL, Power BI, Tableau, R, and Excel. On the dev side: React, JavaScript, HTML/CSS, Java, Flask, MySQL, Docker, and Linux. Ask me about either and I'll go deeper!",
        followUps: [
            "what are your data skills?",
            "what are your dev skills?",
            "what tools do you use?"
        ]
    },
    {
        phrases: [
            "what are your data skills",
            "what do you know for data science",
            "do you know python",
            "do you know sql",
            "what data tools do you use",
            "are you good at statistics",
            "do you use tableau",
            "analytics skills",
            "do you know r"
        ],
        answer: "I have extensive experience with Python, SQL, Power BI, Tableau, R, and Excel.",
        followUps: [
            "what are your dev skills?",
            "what's the airbnb project?"
        ]
    },
    {
        phrases: [
            "what are your dev skills",
            "what programming languages do you know",
            "can you code",
            "do you know javascript",
            "what languages do you program in",
            "engineering skills",
            "do you do frontend",
            "do you know react",
            "what's your tech stack"
        ],
        answer: "React, JavaScript, HTML/CSS, Java, Flask, MySQL, Docker, and Linux.",
        followUps: [
            "what tools do you use?",
            "what's the microgpt project?"
        ]
    },
    {
        phrases: [
            "what tools do you use",
            "what technologies are you familiar with",
            "what software do you use",
            "do you use jira",
            "do you use figma",
            "what ai tools do you use",
            "what platforms do you know"
        ],
        answer: "Jira, Salesforce, Postman, Figma, GitHub Copilot, Claude, and Gemini.",
        followUps: [
            "what are your data skills?",
            "how does this chatbot work?"
        ]
    },

    // -------------------------------------------------------------- projects
    {
        phrases: [
            "what projects have you built",
            "list your projects",
            "show me your work",
            "what have you made",
            "what's in your portfolio",
            "tell me about your projects",
            "what are you working on",
            "any side projects",
            "portfolio",
            "what have u built"
        ],
        answer: "airbnb-albany-pricing, social-data-portfolio, proximity, modified-tiktok-link, etc... Click any card in the project section to see more!",
        followUps: [
            "what's the airbnb project?",
            "what's the proximity project?",
            "what's the social-data-portfolio project?"
        ]
    },
    {
        phrases: [
            "what's the airbnb project",
            "tell me about airbnb-albany-pricing",
            "the pricing model",
            "airbnb",
            "tell me about your ml project",
            "what machine learning have you done",
            "the albany project"
        ],
        answer: "It's an ML pipeline to predict Airbnb booking probability and recommend a competitive nightly price for listings in Albany, NY. The data was trained on 1.66M real calendar-day records from Inside Airbnb. The interesting part was the data integrity work: because it's time-series, I used chronological train/test splits instead of random splits, and caught a leaky neighborhood-occupancy feature mid-build that would've inflated accuracy. Fixed it with K-fold target encoding.",
        followUps: [
            "what's the proximity project?",
            "what are your data skills?"
        ]
    },
    {
        phrases: [
            "what's the proximity project",
            "tell me about the nyc neighborhood map",
            "the neighborhood project",
            "proximity",
            "the map project",
            "the apartment hunting project"
        ],
        answer: "It's an interactive map that lets you score NYC neighborhoods against your own priorities like subway access, safety, proximity to schools, parks, rent, and more. The idea came from a real pain point: apartment hunting with friends where everyone had different tradeoffs and no consistent way to compare. The scoring engine is all Python with no external GIS libraries, so it runs anywhere.",
        followUps: [
            "what's the social-data-portfolio project?",
            "what are your dev skills?"
        ]
    },
    {
        phrases: [
            "what's the social-data-portfolio project",
            "tell me about the world values survey analysis",
            "the wvs project",
            "the r project",
            "the gender attitudes study",
            "your statistics project",
            "the regression project"
        ],
        answer: "Cross-national R analysis using World Values Survey Wave 7 data (~11,000 respondents, 6 countries) — testing whether gender-role attitudes relate to life satisfaction, and whether that relationship varies by country. Used OLS regression, interaction/moderation models, cluster-robust standard errors, and an ordinal logistic regression as a robustness check.",
        followUps: [
            "what's the airbnb project?",
            "why did you choose that major?"
        ]
    },
    {
        phrases: [
            "what's the microgpt project",
            "experimenting-microgpt",
            "the transformer project",
            "the llm project",
            "the karpathy project",
            "have you built an llm"
        ],
        answer: "Exploring some lightweight transformer architecture and inference optimization with MicroGPT. Forked from Andrej Karpathy.",
        followUps: [
            "how does this chatbot work?",
            "what are your dev skills?"
        ]
    },
    {
        phrases: [
            "what's the modified-tiktok project",
            "the tiktok tool",
            "tiktok",
            "the tiktok link project"
        ],
        answer: "A tool to watch TikTok links without the app. I built it after deleting TikTok but I was still getting sent Tiktok videos from friends. I wanted to view those individual videos without reinstalling the app.",
        followUps: [
            "what's the headline-crawler project?",
            "what are your dev skills?"
        ]
    },
    {
        phrases: [
            "what's the headline-crawler project",
            "the news scraper",
            "the web crawler",
            "the scraping project",
            "headline crawler"
        ],
        answer: "Web crawler that scrapes and tracks news headlines. The scraping works, but the bigger goal is compiling it into a single database for analysis, which is still in progress.",
        followUps: [
            "what's the modified-tiktok project?",
            "what are your data skills?"
        ]
    },
    {
        phrases: [
            "what's the cooking-p5 project",
            "the cooking game",
            "cooking p5"
        ],
        answer: "Interactive cooking game in p5.js with hand-drawn Procreate art. It was a group project! The hardest part was coordination, not code, so we locked in shared conventions and a branching workflow early.",
        followUps: [
            "what's farming-p5?",
            "what are your dev skills?"
        ]
    },
    {
        phrases: [
            "what's farming-p5",
            "tell me about the farming game",
            "the stardew valley project",
            "farming p5"
        ],
        answer: "Stardew Valley-inspired farming sim built with p5.js — crop management, seasonal cycles, interactive gameplay. Built it to get more comfortable with p5.js's animation and game-loop model.",
        followUps: [
            "what's the cooking-p5 project?",
            "what are your hobbies?"
        ]
    },
    {
        phrases: [
            "what's the spotify bot",
            "spotify-automation-bot",
            "the spotify project",
            "spotify"
        ],
        answer: "An automation bot to streamline following artists on Spotify.",
        followUps: [
            "what's weather-packed?",
            "what are your dev skills?"
        ]
    },
    {
        phrases: [
            "what's weather-packed",
            "the weather app",
            "the packing app",
            "weather packed"
        ],
        answer: "App that uses weather API data to give personalized packing recommendations based on your destination and travel dates.",
        followUps: [
            "what's the spotify bot?",
            "what tools do you use?"
        ]
    },

    // ------------------------------------------------------- career / hiring
    {
        phrases: [
            "are you looking for a job",
            "what roles are you interested in",
            "are you open to work",
            "are you hiring ready",
            "what kind of role do you want",
            "are you available",
            "are you job hunting",
            "what are you looking for",
            "are you open to opportunities",
            "would you consider a new role",
            "u looking for work"
        ],
        answer: "Yes! I'm looking for data science and PM-adjacent roles. I want to build on my background in computational social science and hands-on experience with data, dashboards, and product-facing tools.",
        followUps: [
            "what are your career goals?",
            "how do I contact you?",
            "do you have a resume?"
        ]
    },
    {
        phrases: [
            "do you have a resume",
            "can i see your cv",
            "resume",
            "cv",
            "where can i find your resume",
            "send me your resume"
        ],
        answer: "Reach out at yanbmia@gmail.com and I'm happy to send it over!",
        followUps: [
            "how do I contact you?",
            "are you looking for a job?"
        ]
    },
    {
        phrases: [
            "what are your career goals",
            "where do you see yourself",
            "what do you want to do long term",
            "what's next for you",
            "future plans",
            "what are your goals"
        ],
        answer: "I want to keep working at the intersection of data and product — using analysis to actually shape what gets built, not just report on it after the fact.",
        followUps: [
            "what are you learning right now?",
            "are you looking for a job?"
        ]
    },
    {
        phrases: [
            "what are you learning right now",
            "what are you studying now",
            "are you learning anything new",
            "what's next on your list to learn",
            "currently learning"
        ],
        answer: "Lately I've been going deeper on experimentation and causal inference — A/B testing methodology, power analysis, that kind of thing. This chatbot was also a way to get hands-on with running ML models client-side.",
        followUps: [
            "what are your career goals?",
            "how does this chatbot work?"
        ]
    },

    // --------------------------------------------------------------- contact
    {
        phrases: [
            "how do i contact you",
            "how can i reach you",
            "what's your email",
            "how do i get in touch",
            "can i email you",
            "contact info",
            "email",
            "how to reach out",
            "what's the best way to contact you",
            "can we connect",
            "how do i message you",
            "get in touch",
            "hows ur email",
            "i'd like to reach out"
        ],
        answer: "You can email me at yanbmia@gmail.com. Additional contact information can be found in the navigation.",
        followUps: [
            "do you have linkedin?",
            "are you looking for a job?"
        ]
    },
    {
        phrases: [
            "do you have linkedin",
            "what's your github",
            "are you on linkedin",
            "link to your github",
            "social media",
            "where can i find your code",
            "github profile"
        ],
        answer: "Both are linked on the contact page — GitHub is github.com/yanbmia and LinkedIn is linkedin.com/in/yanbmia.",
        followUps: [
            "how do I contact you?",
            "do you have a resume?"
        ]
    },

    // ------------------------------------------------------------ reflective
    // DISAMBIGUATION: "strengths" and "passionate about" previously
    // overlapped heavily. Strengths = how you work; passion = what you care
    // about. Phrase lists now avoid sharing "what do you love" style wording.
    {
        phrases: [
            "what are you passionate about",
            "what do you care about",
            "what motivates you",
            "what drives you",
            "what excites you",
            "what do you find meaningful"
        ],
        answer: "I have deep curiosity and desire to understand how people behave. I love building tools that make people's lives easier.",
        followUps: [
            "what are your strengths?",
            "what are your hobbies?"
        ]
    },
    {
        phrases: [
            "what are your strengths",
            "describe your strengths",
            "what are you best at",
            "what would coworkers say about you",
            "how do you work with others",
            "what makes you a good fit"
        ],
        answer: "I'm highly collaborative and love working with different teams. I have strong problem-solving skills. I find the creative process of building out a product/solution to be extremely rewarding.",
        followUps: [
            "what are your weaknesses?",
            "explain your problem solving process"
        ]
    },
    {
        phrases: [
            "what are your weaknesses",
            "describe your weaknesses",
            "what do you struggle with",
            "what are you working on improving",
            "biggest weakness",
            "what's hard for you"
        ],
        answer: "This is always a funny question to answer. But I think I could improve on public speaking. I took a course on it in college, but I still get nervous sometimes.",
        followUps: [
            "what are your strengths?",
            "explain your problem solving process"
        ]
    },
    {
        phrases: [
            "explain your problem solving process",
            "how do you approach problems",
            "how do you solve problems",
            "walk me through how you work",
            "what's your process",
            "how do you tackle a hard problem"
        ],
        answer: "Hmm...Every situation is different, but I usually start by breaking the problem down into smaller pieces, identifying the key challenges, and then brainstorming potential solutions. I like to test out ideas quickly and iterate based on feedback.",
        followUps: [
            "what are your strengths?",
            "what projects have you built?"
        ]
    },

    // ------------------------------------------------------------ meta/site
    {
        phrases: [
            "how does this chatbot work",
            "are you an ai",
            "is this chatgpt",
            "what powers this chat",
            "are you a real person",
            "what model is this",
            "how did you build this bot",
            "is this using an api"
        ],
        answer: "I'm a small sentence-embedding model (all-MiniLM-L6-v2) running fully in your browser. No API, no server, no data leaving your machine. I match your question against a set of answers wrote by meaning rather than keywords.",
        followUps: [
            "what are your dev skills?",
            "what projects have you built?"
        ]
    },
    {
        phrases: [
            "tell me about the photos",
            "who took these pictures",
            "what's the gallery",
            "do you do photography",
            "where were these photos taken",
            "your photos"
        ],
        answer: "Photos are from recent trips! I love to see new places and meet new people. Photos are my way of capturing a memory.",
        followUps: [
            "what are your hobbies?",
            "tell me something interesting about you"
        ]
    }

];
