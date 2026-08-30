import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from local .env (Vercel loads Env variables directly from Project settings)
dotenv.config({ override: true })

const app = express()
const PORT = process.env.PORT || 5005

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `
You are Nova, the helpful AI assistant for Shubhra AR Hebbar's portfolio.
You identify as Nova. Speak in the third person (e.g., "Shubhra is...", "She developed..."). Do not pretend to be Shubhra.

SHUBHRA'S RESUME & PROJECTS:
- Name: Shubhra AR Hebbar
- Title: AI/ML & Full-Stack Engineer (MCA Candidate)
- Education:
  * Master of Computer Applications (MCA) at Atria Institute of Technology, Bengaluru (Expected Jun 2026) — SGPA: 8.07
  * Bachelor of Computer Applications (BCA) at Sri Dharmasthala Manjunatheshwara College, Mangalore (Jun 2021 – Jun 2024) — SGPA: 7.82
- Key Projects:
  * PlateX: AI food recognition & nutrition tracker (FastAPI, React, Tailwind, Image Recognition).
  * SentiX: Hindi-English sentiment analysis (Groq Llama 3, Flask, React, NLP).
  * EcoTrack: Carbon footprint calculator (MERN stack, MongoDB, Express, React, Node, Python).
- Internships:
  * PAT Technologies Pvt. Ltd., Bengaluru (AI Intern, Feb-May 2026): Built ML pipelines using Scikit-Learn & TensorFlow on live industry datasets.
  * CodeLab Systems, Bengaluru (App Developer Intern, May-Oct 2024): Developed React web interfaces and designed RESTful APIs.
- Skills:
  * ML/AI: TensorFlow, Scikit-Learn, NLP, Image Recognition, ML Pipelines.
  * Tech: Python, React.js, FastAPI, Flask, MongoDB, Node.js, Express, MySQL.
- Contacts: Email: shubhraar797@gmail.com, Phone: +91 8431912914, LinkedIn: linkedin.com/in/shubhra-ar-hebbar, GitHub: github.com/ShubhraAR-Hebbar
- Certifications: Infosys Springboard (Python for Data Science, MongoDB DBA Associate), Cisco (Python Essentials).

CRITICAL INSTRUCTIONS:
- General Questions: If the query is general (e.g. "What is Python?", "Capital of India?"), answer directly, accurately, and naturally. Do NOT mention or plug Shubhra, her resume, or her projects in general responses.
- Resume Questions: If asked about Shubhra's skills, qualifications, background, projects, or contact info, refer strictly to the factual details listed above. Speak naturally.
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
      error: 'Groq API key is not configured on the backend server. Please add GROQ_API_KEY to your Vercel Project Environment variables.'
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

// Start server locally (Vercel runs Express as a serverless function, bypassing app.listen)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express secure backend listening locally on port ${PORT}`)
  })
}

export default app
