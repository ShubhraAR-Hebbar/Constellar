import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from project root .env
dotenv.config({ path: path.resolve(process.cwd(), '../.env'), override: true })
dotenv.config({ override: true })

const app = express()
const PORT = process.env.PORT || 5005

console.log('Server config check:')
console.log('- process.cwd():', process.cwd())
console.log('- GROQ_API_KEY loaded:', process.env.GROQ_API_KEY ? `Yes (length: ${process.env.GROQ_API_KEY.length}, starts with: ${process.env.GROQ_API_KEY.slice(0, 8)})` : 'No')

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `
You are Nova, the brilliant, helpful, and friendly AI portfolio assistant for Shubhra AR Hebbar.

Your personality: professional, helpful, polite, and witty.
You identify yourself as Nova, Shubhra's AI assistant, embedded in her portfolio website.
You must speak in the third person when referring to Shubhra (e.g., "Shubhra has worked on...", "She knows..."). Do not pretend to be Shubhra.

SHUBHRA'S RESUME & PORTFOLIO INFORMATION:
- Name: Shubhra AR Hebbar
- Title: AI/ML & Full-Stack Engineer
- Subtitle: MCA Candidate · Bengaluru, India
- Phone: +91 8431912914
- Email: shubhraar797@gmail.com
- LinkedIn: https://linkedin.com/in/shubhra-ar-hebbar
- GitHub: https://github.com/ShubhraAR-Hebbar
- Professional Summary: AI/ML and Full-Stack Engineer (MCA, SGPA 8.07) with hands-on internship experience across three companies building end-to-end ML pipelines, NLP-based content moderation systems, and production-ready web applications. Proficient in Python, React.js, TensorFlow, and modern AI frameworks.
- Education:
  * Master of Computer Applications (MCA) at Atria Institute of Technology, Bengaluru (Expected Jun 2026) — SGPA: 8.07
  * Bachelor of Computer Applications (BCA) at Sri Dharmasthala Manjunatheshwara College, Mangalore (Jun 2021 – Jun 2024) — SGPA: 7.82
- Skills:
  * Languages: Python, JavaScript (ES6+), HTML5, CSS3
  * AI/ML: TensorFlow, Scikit-Learn, Natural Language Processing (NLP), Large Language Models (LLMs), Image Recognition, ML Pipelines
  * Frontend: React.js, Tailwind CSS, Three.js / WebGL, GSAP, Framer Motion
  * Backend: FastAPI, Flask, Node.js, Express.js, RESTful APIs
  * Databases: MongoDB, MySQL
  * Tools & CS Fundamentals: Git, GitHub, Agile/Scrum, Data Structures & Algorithms (DSA), OOP
- Experience:
  * AI Intern at PAT Technologies Pvt. Ltd., Bengaluru (Feb 2026 – May 2026): Built end-to-end ML pipelines using Scikit-Learn & TensorFlow on live industry datasets.
  * Application Developer Intern at CodeLab Systems, Bengaluru (May 2024 – Oct 2024): Developed responsive React web interfaces, built RESTful APIs, and worked under Agile.
- Projects:
  * PlateX: AI-powered food recognition & nutrition tracker using Python, Image Recognition, FastAPI, React, and Tailwind.
  * SentiX: Code-mixed Hindi-English sentiment analysis tool using Python, Llama 3 (via Groq API), NLP, Flask, and React.
  * EcoTrack: Carbon footprint calculator estimating emissions from energy/waste/diet, using MERN stack (MongoDB, Express, React, Node) and Python.
- Leadership & Activities:
  * Web Master at Rotaract Club (managed digital presence, chaired 5+ events).
  * Facility Lead at FXC Club, MCA (mentored junior students).
  * Coordinator at Atria Ignite 2026 (state-level technical collegiate summit).
  * Rovers Ranger at International Cultural Jamboree (Moodbidri).
- Certifications:
  * Python for Data Science (Infosys Springboard, 2025)
  * MongoDB Certified DBA Associate (C100DBA) (Infosys Springboard, 2025)
  * Programming Essentials in Python (Cisco Networking Academy, 2025)
  * Web Application Development & React JS App Dev (CodeLab Systems, 2024)

CRITICAL INSTRUCTIONS:
- If the visitor asks about Shubhra's resume, qualifications, background, projects, contact info, or skills, refer to the factual details listed above. Speak naturally and format clearly.
- You have broad general knowledge and can answer general questions (e.g., "What is Python?", "Explain machine learning").
- Do NOT invent or assume any personal details not listed above. If asked about something not in the context, politely state that you do not have that information in her portfolio context.
- Render responses in clean Markdown (bold, lists, tables). Use backticks for inline code, and fenced code blocks for programming snippets.
`;

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'allam-2-7b';

app.post('/api/chat', async (req, res) => {
  const { prompt, history = [] } = req.body

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' })
  }

  const key = GROQ_API_KEY
  if (!key) {
    return res.status(500).json({
      error: 'Groq API key is not configured on the backend server. Please add GROQ_API_KEY to your .env file.'
    })
  }

  try {
    // Format conversation history to match OpenAI/Groq standard role names (user/assistant)
    const formattedHistory = history.map((m) => {
      const isUser = m.sender === 'user' || m.role === 'user'
      return {
        role: isUser ? 'user' : 'assistant',
        content: m.text || m.content || ''
      }
    })

    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...formattedHistory,
        { role: 'user', content: prompt.trim() }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      const msg = err?.error?.message || `Groq API error ${response.status}: ${response.statusText}`
      return res.status(response.status).json({ error: msg })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || 'No response received.'

    // Auto-inject co-pilot navigation buttons based on response content
    const lower = content.toLowerCase()
    const actions = []

    if (lower.includes('project') || lower.includes('platex') || lower.includes('sentix') || lower.includes('ecotrack')) {
      actions.push({ label: '🚀 Jump to Projects', type: 'navigate', value: 0.57 })
    }
    if (lower.includes('experience') || lower.includes('pat technologies') || lower.includes('codelab')) {
      actions.push({ label: '💼 View Experience', type: 'navigate', value: 0.32 })
    }
    if (lower.includes('skill') || lower.includes('tensorflow') || lower.includes('python')) {
      actions.push({ label: '🌌 View Skills', type: 'navigate', value: 0.18 })
    }
    if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('linkedin')) {
      actions.push({ label: '📬 Contact Section', type: 'navigate', value: 0.93 })
    }

    return res.json({
      text: content,
      actions,
      suggestions: [
        'Tell me more about her AI projects',
        'What are her key skills?',
        'How can I contact her?'
      ]
    })

  } catch (error) {
    console.error('Server error handling chat:', error)
    return res.status(500).json({ error: 'Server error: ' + error.message })
  }
})

// Title generator endpoint using Llama 3
app.post('/api/title', async (req, res) => {
  const { firstMessage } = req.body
  const key = GROQ_API_KEY
  if (!key || !firstMessage) {
    return res.json({ title: firstMessage ? firstMessage.slice(0, 40) : 'New Chat' })
  }

  try {
    const body = {
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: `Generate a short 4-6 word chat title for this message (no quotes, no punctuation): "${firstMessage}"`
        }
      ],
      max_tokens: 20,
      temperature: 0.4
    }
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    const title = data.choices?.[0]?.message?.content?.trim()
    return res.json({ title: title || firstMessage.slice(0, 40) })
  } catch {
    return res.json({ title: firstMessage.slice(0, 40) })
  }
})

app.listen(PORT, () => {
  console.log(`Express secure backend listening on port ${PORT}`)
})