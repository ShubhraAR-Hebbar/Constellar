/**
 * sendMessage — Posts message & history to secure backend endpoint (/api/chat).
 * Injected with proxy forwarding to Express backend on port 5000.
 *
 * @param {{ prompt: string, history: Array }} params
 * @returns {Promise<{ text: string, actions?: Array, suggestions?: Array }>}
 */
export async function sendMessage({ prompt, history = [] }) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const msg = errData?.error || `API error ${response.status}: ${response.statusText}`
    throw new Error(msg)
  }

  return response.json()
}