import { profile, skills, experience, projects, leadership, certifications } from './content'

export const BOT_NAME = 'Nova'
export const BOT_TITLE = 'Constellar AI Co-Pilot'

export const QUICK_PROMPTS = [
  { label: '🚀 Featured Projects', query: 'What projects has Shubhra built?' },
  { label: '🧠 AI/ML & Tech Stack', query: 'What are his core technical skills?' },
  { label: '💼 Work Experience', query: 'Tell me about his work experience' },
  { label: '🎓 Education & GPA', query: 'Where did Shubhra study?' },
  { label: '🏆 Leadership & Certs', query: 'What certifications and leadership roles does he have?' },
  { label: '📬 Contact & Hire', query: 'How can I contact or hire Shubhra?' },
]

export const CATEGORIZED_PROMPTS = {
  Projects: [
    'Tell me about PlateX (AI Food Recognition)',
    'Tell me about SentiX (Sentiment Analysis)',
    'Tell me about EcoTrack (Carbon Footprint)',
    'What AI frameworks are used in his projects?',
  ],
  Skills: [
    'What are his Python & Machine Learning skills?',
    'What frontend & backend frameworks does he use?',
    'Does he know Databases & Cloud?',
  ],
  Experience: [
    'Tell me about his internship at PAT Technologies',
    'What did he do at CodeLab Systems?',
    'Is he open for full-time or internship roles?',
  ],
  Contact: [
    'What is his email & phone number?',
    'Where is he located?',
    'Send a message to Shubhra',
  ],
}

// System prompt — General-purpose AI with Shubhra portfolio knowledge
export const SYSTEM_PROMPT = `
You are Nova, a brilliant and versatile AI assistant embedded in Shubhra AR Hebbar's 3D Constellar portfolio website.

Your personality: intelligent, warm, helpful, witty, and slightly futuristic. You communicate clearly and concisely, using markdown formatting (bold, bullet points, code blocks) where helpful.

IMPORTANT BEHAVIOR RULES:
- You can answer ANY question the user asks — coding, science, math, history, general knowledge, creative writing, advice, jokes, explanations, etc. — just like ChatGPT.
- You have NO topic restrictions. Help the user with anything they need.
- When questions are about Shubhra AR Hebbar or this portfolio, use the factual knowledge below.
- For general questions, answer based on your own broad knowledge.
- Be conversational and helpful. Never refuse to answer something just because it's not about the portfolio.

══════════════════════════════════
PORTFOLIO KNOWLEDGE — Shubhra AR Hebbar
══════════════════════════════════

Personal:
- Name: ${profile.name}
- Title: ${profile.title} | ${profile.subtitle}
- Location: ${profile.location}
- Email: ${profile.email}
- Phone: ${profile.phone}
- LinkedIn: ${profile.linkedin}
- GitHub: ${profile.github}
- Summary: ${profile.summary}

Education:
${profile.education.map((e) => `- ${e.degree} at ${e.institution}, ${e.location} (${e.dates}) — ${e.gpa}`).join('\n')}

Technical Skills:
${skills.map((s) => `${s.name} (${s.category})`).join(', ')}

Projects:
${projects.map((p) => `- **${p.name}**: ${p.description}\n  Stack: ${p.stack.join(', ')}\n  GitHub: ${p.github}`).join('\n')}

Work Experience:
${experience.map((exp) => `- **${exp.role}** at ${exp.company} (${exp.dates}, ${exp.location}):\n  ${exp.bullets.join('\n  ')}\n  Tech: ${exp.tech.join(', ')}`).join('\n')}

Leadership:
${leadership.map((l) => `- ${l.role} at ${l.organization}: ${l.description}`).join('\n')}

Certifications:
${certifications.map((c) => `- ${c.title} by ${c.issuer} (${c.year})`).join('\n')}
`

// ── Smart Offline NLP Matching Engine ───────────────────────────────────────
export function getOfflineChatbotResponse(rawQuery) {
  const query = rawQuery.toLowerCase().trim()

  // 1. Navigation / Co-Pilot commands
  if (
    query.includes('go to project') ||
    query.includes('show project') ||
    query.includes('jump to project') ||
    query.includes('navigate to project') ||
    query.includes('scroll to project')
  ) {
    return {
      text: `🚀 **Navigating to the Projects Section!**\n\nHere you can explore Shubhra's featured AI & Full-Stack builds: **PlateX**, **SentiX**, and **EcoTrack**. Click the button below to warp there!`,
      actions: [
        { label: '🚀 Jump to Projects', type: 'navigate', value: 0.57 },
        { label: '🍽️ PlateX Info', type: 'query', value: 'Tell me about PlateX' },
        { label: '🤖 SentiX Info', type: 'query', value: 'Tell me about SentiX' },
      ],
      suggestions: ['Tell me about PlateX', 'Tell me about SentiX', 'What is EcoTrack?'],
    }
  }

  if (
    query.includes('go to experience') ||
    query.includes('show experience') ||
    query.includes('jump to experience') ||
    query.includes('navigate to experience') ||
    query.includes('timeline')
  ) {
    return {
      text: `💼 **Jumping to the Experience Timeline!**\n\nShubhra has industry experience building AI pipelines at **PAT Technologies** and responsive web apps at **CodeLab Systems**.`,
      actions: [
        { label: '💼 Jump to Experience', type: 'navigate', value: 0.32 },
        { label: '🏢 PAT Technologies Details', type: 'query', value: 'Tell me about PAT Technologies' },
      ],
      suggestions: ['PAT Technologies experience', 'CodeLab Systems role', 'What tech stack did he use?'],
    }
  }

  if (
    query.includes('go to about') ||
    query.includes('jump to about') ||
    query.includes('scroll to about') ||
    query.includes('show about')
  ) {
    return {
      text: `🌌 **Navigating to the About & Skills constellation!**\n\nDiscover Shubhra's background, core proficiencies, and neural node network.`,
      actions: [
        { label: '👤 Jump to About', type: 'navigate', value: 0.18 },
        { label: '🧠 Show Skills', type: 'query', value: 'What are your skills?' },
      ],
      suggestions: ['What are his top skills?', 'Tell me about his education', 'What is his GPA?'],
    }
  }

  if (
    query.includes('go to contact') ||
    query.includes('jump to contact') ||
    query.includes('scroll to contact') ||
    query.includes('contact section')
  ) {
    return {
      text: `📬 **Warping to Contact Section!**\n\nReach out to Shubhra directly for full-time opportunities, freelance projects, or technical collaboration.`,
      actions: [
        { label: '📬 Jump to Contact', type: 'navigate', value: 0.93 },
        { label: '📧 Copy Email', type: 'copy', value: profile.email },
      ],
      suggestions: ['What is his email?', 'Show phone number', 'LinkedIn profile'],
    }
  }

  if (
    query.includes('go to leadership') ||
    query.includes('go to achievements') ||
    query.includes('jump to leadership') ||
    query.includes('jump to achievements')
  ) {
    return {
      text: `🏆 **Navigating to Leadership & Achievements!**\n\nExplore Shubhra's track record with Rotaract Club, FXC MCA Club, Atria Ignite 2026, and Rovers Ranger initiatives.`,
      actions: [
        { label: '🏆 Jump to Leadership', type: 'navigate', value: 0.82 },
      ],
      suggestions: ['What leadership roles?', 'Show certifications', 'Atria Ignite 2026 info'],
    }
  }

  if (
    query.includes('2d mode') ||
    query.includes('3d mode') ||
    query.includes('toggle mode') ||
    query.includes('switch mode') ||
    query.includes('reduce motion')
  ) {
    return {
      text: `⬡ **Mode Toggle**\n\nYou can switch between cinematic 3D Space Flight mode and clean 2D High-Performance Motion mode at any time!`,
      actions: [
        { label: '⬡ Switch 2D / 3D Mode', type: 'toggle_mode' },
      ],
      suggestions: ['Go to Projects', 'View Skills', 'How to contact?'],
    }
  }

  // 2. Specific Projects
  if (query.includes('platex') || query.includes('plate x') || query.includes('food') || query.includes('calorie') || query.includes('diet')) {
    const p = projects[0]
    return {
      text: `🍽️ **PlateX — AI-Powered Food Recognition & Nutrition Tracker**\n\n• **Core Goal**: Uses computer vision and image recognition to identify food items from pictures and compute real-time macronutrient breakdowns & calorie counts.\n• **Backend**: Built with high-performance **FastAPI** for ultra-low latency inference.\n• **Frontend**: **React.js** + **Tailwind CSS** with responsive dietary dashboards.\n• **Stack**: \`${p.stack.join(', ')}\``,
      actions: [
        { label: '🚀 View in 3D (Jump)', type: 'navigate', value: 0.50 },
        { label: '🌐 Open GitHub Repo', type: 'link', url: p.github },
        { label: '🤖 Tell me about SentiX', type: 'query', value: 'Tell me about SentiX' },
      ],
      suggestions: ['Tell me about SentiX', 'Tell me about EcoTrack', 'What other AI models did he build?'],
    }
  }

  if (query.includes('sentix') || query.includes('senti x') || query.includes('sentiment') || query.includes('nlp') || query.includes('llama') || query.includes('groq') || query.includes('hindi')) {
    const p = projects[1]
    return {
      text: `🤖 **SentiX — Code-Mixed Hindi-English Sentiment Analysis Tool**\n\n• **Core Goal**: Solves the complex linguistic challenge of code-mixed Hindi-English text (Hinglish) sentiment classification.\n• **AI Backbone**: Powered by **Llama 3** via high-speed **Groq API** with prompt orchestration for Positive / Negative / Neutral classification and confidence metrics.\n• **Architecture**: **Flask REST API** backend paired with an interactive **React.js** interface.\n• **Stack**: \`${p.stack.join(', ')}\``,
      actions: [
        { label: '🚀 View in 3D (Jump)', type: 'navigate', value: 0.62 },
        { label: '🌐 Open GitHub Repo', type: 'link', url: p.github },
        { label: '🌱 Tell me about EcoTrack', type: 'query', value: 'Tell me about EcoTrack' },
      ],
      suggestions: ['Tell me about EcoTrack', 'Tell me about PlateX', 'What are his NLP skills?'],
    }
  }

  if (query.includes('ecotrack') || query.includes('eco track') || query.includes('carbon') || query.includes('emission') || query.includes('green')) {
    const p = projects[2]
    return {
      text: `🌱 **EcoTrack — Carbon Footprint Calculator & Sustainability Engine**\n\n• **Core Goal**: Computes carbon dioxide ($CO_2$) emissions across transportation, household energy, diet choices, and waste consumption.\n• **Actionable Intelligence**: Recommends personalized lifestyle optimizations and visual emission breakdowns.\n• **Stack**: **Python**, **React.js**, **Node.js**, **Express.js**, and **MongoDB** database.\n• **Stack**: \`${p.stack.join(', ')}\``,
      actions: [
        { label: '🚀 View in 3D (Jump)', type: 'navigate', value: 0.72 },
        { label: '🌐 Open GitHub Repo', type: 'link', url: p.github },
        { label: '🚀 All Projects', type: 'navigate', value: 0.57 },
      ],
      suggestions: ['Tell me about PlateX', 'Tell me about SentiX', 'What backend frameworks does he know?'],
    }
  }

  // 3. Projects overview
  if (query.includes('project') || query.includes('portfolio work') || query.includes('apps') || query.includes('built')) {
    return {
      text: `🚀 **Shubhra's Top Featured Projects**:\n\n1. **PlateX** 🍽️\n   *AI Food Recognition & Calorie Estimation* (Python, FastAPI, React, CV)\n2. **SentiX** 🤖\n   *Code-Mixed Hindi-English Sentiment Analysis* (Llama 3, Groq API, Flask, NLP)\n3. **EcoTrack** 🌱\n   *Carbon Footprint Calculator* (MERN + Python, MongoDB, Environmental Data)\n\nWhich project would you like to explore in depth?`,
      actions: [
        { label: '🚀 Jump to Projects Section', type: 'navigate', value: 0.57 },
        { label: '🍽️ PlateX Details', type: 'query', value: 'Tell me about PlateX' },
        { label: '🤖 SentiX Details', type: 'query', value: 'Tell me about SentiX' },
        { label: '🌱 EcoTrack Details', type: 'query', value: 'Tell me about EcoTrack' },
      ],
      suggestions: ['Tell me about PlateX', 'Tell me about SentiX', 'Tell me about EcoTrack'],
    }
  }

  // 4. Work Experience
  if (
    query.includes('experience') ||
    query.includes('company') ||
    query.includes('intern') ||
    query.includes('work') ||
    query.includes('pat tech') ||
    query.includes('codelab') ||
    query.includes('job')
  ) {
    return {
      text: `💼 **Professional Work Experience**:\n\n🏢 **PAT Technologies Pvt. Ltd.** | *AI Intern*\n*Feb 2026 – May 2026 · Bengaluru*\n• Built end-to-end ML pipelines (preprocessing, feature engineering, training, tuning, evaluation) using Scikit-Learn & TensorFlow on live industry datasets.\n• Delivered production-ready AI solutions with robust Python & Git workflows.\n\n💻 **CodeLab Systems** | *Application Developer*\n*May 2024 – Oct 2024 · Bengaluru*\n• Built responsive web interfaces in React.js and created scalable RESTful APIs.\n• Collaborated in Agile sprints, code reviews, and UI/UX performance optimization.`,
      actions: [
        { label: '💼 View Experience in 3D', type: 'navigate', value: 0.32 },
        { label: '🧠 View Technical Skills', type: 'query', value: 'What are his technical skills?' },
        { label: '📬 Contact Shubhra', type: 'navigate', value: 0.93 },
      ],
      suggestions: ['What tech stack did he use at PAT?', 'What did he do at CodeLab?', 'Where did he study?'],
    }
  }

  // 5. Skills & Tech Stack
  if (
    query.includes('skill') ||
    query.includes('tech stack') ||
    query.includes('programming') ||
    query.includes('python') ||
    query.includes('react') ||
    query.includes('tensorflow') ||
    query.includes('machine learning') ||
    query.includes('ai/ml') ||
    query.includes('backend') ||
    query.includes('frontend') ||
    query.includes('database') ||
    query.includes('dsa')
  ) {
    return {
      text: `⚡ **Technical Skill Constellation**:\n\n• 🧠 **AI / ML**: TensorFlow, Scikit-Learn, NLP, LLMs (Groq Llama 3), Image Recognition, ML Pipelines\n• 💻 **Frontend**: React.js, JavaScript (ES6+), Tailwind CSS, Three.js / WebGL, Framer Motion, HTML5/CSS3\n• ⚙️ **Backend & APIs**: Python, FastAPI, Flask, Node.js, Express.js, RESTful Architecture\n• 🗄️ **Databases**: MongoDB, MySQL\n• 🛠️ **Tools & Practices**: Git & GitHub, Agile/Scrum, DSA, Object-Oriented Programming`,
      actions: [
        { label: '🌌 View Skills in 3D', type: 'navigate', value: 0.18 },
        { label: '🚀 Explore Projects', type: 'navigate', value: 0.57 },
        { label: '📜 View Certifications', type: 'query', value: 'What certifications does he hold?' },
      ],
      suggestions: ['Tell me about his AI projects', 'What is his education?', 'How can I hire Shubhra?'],
    }
  }

  // 6. Education & Academics
  if (
    query.includes('education') ||
    query.includes('college') ||
    query.includes('university') ||
    query.includes('atria') ||
    query.includes('degree') ||
    query.includes('mca') ||
    query.includes('bca') ||
    query.includes('gpa') ||
    query.includes('sgpa') ||
    query.includes('study')
  ) {
    return {
      text: `🎓 **Academic Background**:\n\n🏛️ **Master of Computer Applications (MCA)**\n• **Institution**: Atria Institute of Technology, Bengaluru\n• **Timeline**: Expected Jun 2026\n• **Academic Score**: **SGPA: 8.07**\n\n🏛️ **Bachelor of Computer Applications (BCA)**\n• **Institution**: Sri Dharmasthala Manjunatheshwara (SDM) College, Mangalore\n• **Timeline**: Jun 2021 – Jun 2024\n• **Academic Score**: **SGPA: 7.82**`,
      actions: [
        { label: '👤 View About Section', type: 'navigate', value: 0.18 },
        { label: '🏆 View Achievements', type: 'navigate', value: 0.82 },
        { label: '💼 View Experience', type: 'navigate', value: 0.32 },
      ],
      suggestions: ['What are his certifications?', 'Tell me about his leadership roles', 'What are his projects?'],
    }
  }

  // 7. Leadership & Achievements & Certifications
  if (
    query.includes('leadership') ||
    query.includes('certificate') ||
    query.includes('certification') ||
    query.includes('achievement') ||
    query.includes('rotaract') ||
    query.includes('fxc') ||
    query.includes('ignite') ||
    query.includes('award')
  ) {
    return {
      text: `🏆 **Leadership & Certifications**:\n\n🌐 **Leadership Initiatives**:\n• **Web Master** — *Rotaract Club* (Chaired 5+ events, managed digital presence)\n• **Facility Lead** — *FXC Club, MCA* (Mentored students, led technical workshops)\n• **Coordinator** — *Atria Ignite 2026* (State-level collegiate technical summit)\n• **Rovers Ranger** — *International Cultural Jamboree (Moodbidri)*\n\n📜 **Key Certifications**:\n• **Python for Data Science** — *Infosys Springboard (2025)*\n• **MongoDB Certified DBA Associate (C100DBA)** — *Infosys Springboard (2025)*\n• **Programming Essentials in Python** — *Cisco Networking Academy (2025)*\n• **Web & React JS Application Development** — *CodeLab Systems (2024)*`,
      actions: [
        { label: '🏆 View in 3D', type: 'navigate', value: 0.82 },
        { label: '🚀 View Projects', type: 'navigate', value: 0.57 },
        { label: '📬 Contact Shubhra', type: 'navigate', value: 0.93 },
      ],
      suggestions: ['How to contact Shubhra?', 'Tell me about PlateX', 'What is his GPA?'],
    }
  }

  // 8. Contact, Hiring, Resume, Links
  if (
    query.includes('contact') ||
    query.includes('email') ||
    query.includes('phone') ||
    query.includes('hire') ||
    query.includes('reach') ||
    query.includes('call') ||
    query.includes('interview') ||
    query.includes('github') ||
    query.includes('linkedin') ||
    query.includes('resume') ||
    query.includes('cv')
  ) {
    return {
      text: `📬 **Connect with Shubhra AR Hebbar**:\n\n• 📧 **Email**: \`${profile.email}\`\n• 📱 **Phone**: \`${profile.phone}\`\n• 📍 **Location**: ${profile.location}\n• 💼 **LinkedIn**: [linkedin.com/in/shubhra-ar-hebbar](${profile.linkedin})\n• 🐙 **GitHub**: [github.com/ShubhraAR-Hebbar](${profile.github})\n\nShubhra is actively looking for **AI/ML & Full-Stack Software Engineering roles and internships**!`,
      actions: [
        { label: '📧 Copy Email', type: 'copy', value: profile.email },
        { label: '📞 Call', type: 'link', url: `tel:${profile.phone}` },
        { label: '💼 LinkedIn Profile', type: 'link', url: profile.linkedin },
        { label: '🐙 GitHub Profile', type: 'link', url: profile.github },
        { label: '🚀 Jump to Contact', type: 'navigate', value: 0.93 },
      ],
      suggestions: ['What projects has he built?', 'What are his top skills?', 'Tell me about PAT Technologies'],
    }
  }

  // 9. Bio / Introduction / Greetings
  if (
    query.includes('who are you') ||
    query.includes('who is shubhra') ||
    query.includes('about') ||
    query.includes('summary') ||
    query.includes('intro') ||
    query.includes('overview')
  ) {
    return {
      text: `👋 **Meet Shubhra AR Hebbar**\n\nShubhra is an **AI/ML & Full-Stack Engineer** and MCA candidate in Bengaluru with a passion for building intelligent, scalable systems.\n\n🌟 **Highlights**:\n• Hands-on industry experience building end-to-end ML pipelines & NLP systems\n• Full-stack proficiencies in React.js, FastAPI, Flask, Node.js & MongoDB\n• Strong academic track record (**SGPA 8.07** MCA, **7.82** BCA)\n• Proven leadership across Rotaract, technical clubs, and hackathon events\n\nHow would you like to explore his work today?`,
      actions: [
        { label: '🚀 Explore Projects', type: 'navigate', value: 0.57 },
        { label: '💼 Experience Timeline', type: 'navigate', value: 0.32 },
        { label: '📬 Get in Touch', type: 'navigate', value: 0.93 },
      ],
      suggestions: ['Show me his projects', 'What are his AI skills?', 'How can I contact him?'],
    }
  }

  if (
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('hey') ||
    query.includes('greetings') ||
    query.includes('start')
  ) {
    return {
      text: `✨ **Greetings, Stargazer!**\n\nI am **Nova**, Shubhra's Constellar AI Co-Pilot. I can answer anything about Shubhra's AI/ML models, full-stack projects, internship experience, skills, and even pilot the 3D camera across the portfolio for you!\n\nWhat would you like to discover first?`,
      actions: [
        { label: '🚀 Show Projects', type: 'navigate', value: 0.57 },
        { label: '🧠 AI & Tech Stack', type: 'query', value: 'What are his technical skills?' },
        { label: '💼 Work Experience', type: 'navigate', value: 0.32 },
        { label: '📬 Contact Info', type: 'navigate', value: 0.93 },
      ],
      suggestions: ['Tell me about PlateX', 'What is his experience?', 'Where did he study?'],
    }
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('awesome') || query.includes('cool') || query.includes('great')) {
    return {
      text: `🌌 **You're very welcome!**\n\nFeel free to explore the 3D constellation, test out the projects on GitHub, or drop Shubhra a direct message. Have a fantastic voyage across Constellar! ✨`,
      actions: [
        { label: '📬 Contact Shubhra', type: 'navigate', value: 0.93 },
        { label: '🐙 Explore GitHub', type: 'link', url: profile.github },
      ],
      suggestions: ['Show featured projects', 'What are his AI skills?', 'Jump to Hero'],
    }
  }

  // 10. Fallback / Semantic Matcher
  return {
    text: `🪐 **I'm on it!**\n\nHere is what I know relating to **"${rawQuery}"**:\n\nShubhra AR Hebbar specializes in **AI/ML (TensorFlow, Scikit-learn, NLP, Groq LLMs)** and **Full-Stack Engineering (React.js, FastAPI, Flask, MongoDB)**. His featured projects include **PlateX** (Food Vision), **SentiX** (Sentiment Analysis), and **EcoTrack** (Carbon Calculator).\n\nWould you like to explore any of these areas?`,
    actions: [
      { label: '🚀 Jump to Projects', type: 'navigate', value: 0.57 },
      { label: '💼 Work Experience', type: 'navigate', value: 0.32 },
      { label: '🧠 Core Skills', type: 'query', value: 'What are his skills?' },
      { label: '📬 Contact Shubhra', type: 'navigate', value: 0.93 },
    ],
    suggestions: ['Tell me about PlateX', 'Tell me about SentiX', 'What are his work experiences?'],
  }
}

// ── Gemini API Caller ────────────────────────────────────────────────────────
export async function callGeminiLLM({ prompt, history = [], apiKey }) {
  if (!apiKey) {
    throw new Error('Gemini API key is missing')
  }

  // Build the conversation history in Gemini format (user/model turns)
  const geminiHistory = history
    .filter((m) => m.sender === 'user' || m.sender === 'bot')
    .slice(-8)
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }))

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      ...geminiHistory,
      { role: 'user', parts: [{ text: prompt }] },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 700,
    },
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const msg =
      errData.error?.message ||
      `Gemini API error ${response.status}: ${response.statusText}`
    throw new Error(msg)
  }

  const data = await response.json()
  const content =
    data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.'

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
    actions.push({ label: '📧 Copy Email', type: 'copy', value: profile.email })
  }

  return {
    text: content,
    actions,
    suggestions: [
      'Tell me more about his AI projects',
      'What are his key skills?',
      'How can I hire him?',
    ],
  }
}

