/**
 * Send a message to Gemini via Express secure backend (/api/chat).
 * Maintains full conversation history for context memory.
 *
 * @param {string} userMessage - The new user message
 * @param {Array} history - Previous messages [{role:'user'|'model', parts:[{text}]}]
 * @returns {Promise<string>} The AI response text
 */
export async function sendToGemini(userMessage, history = []) {
  // Format the history from useChat format [{role: 'user'|'model', content: '...'}]
  // to the general format [{sender: 'user'|'bot', text: '...'}] that /api/chat handles
  const formattedHistory = history.map((m) => ({
    sender: m.role === 'user' ? 'user' : 'bot',
    text: m.parts?.[0]?.text || m.content || '',
  }))

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: userMessage,
      history: formattedHistory,
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const msg = errData?.error || `API error ${response.status}: ${response.statusText}`
    throw new Error(msg)
  }

  const data = await response.json()
  return data.text
}

/**
 * Auto-generate a short title from the first user message via the backend.
 */
export async function generateTitle(firstMessage) {
  try {
    const response = await fetch('/api/title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstMessage }),
    })
    const data = await response.json()
    return data.title || firstMessage.slice(0, 40)
  } catch {
    return firstMessage.slice(0, 40)
  }
}