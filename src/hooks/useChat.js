import { useState, useCallback } from 'react'
import { sendToGemini, generateTitle } from '../services/geminiService'

/**
 * useChat — manages the active conversation state and AI messaging
 */
export function useChat({ activeConvId, getConversation, updateConversation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeConversation = activeConvId ? getConversation(activeConvId) : null
  const messages = activeConversation?.messages || []

  const sendMessage = useCallback(
    async (userText) => {
      if (!activeConvId || !userText.trim() || isLoading) return
      setError(null)

      const userMsg = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userText.trim(),
        timestamp: Date.now(),
      }

      const conv = getConversation(activeConvId)
      const updatedMessages = [...(conv?.messages || []), userMsg]
      const updatedGeminiHistory = [
        ...(conv?.geminiHistory || []),
        { role: 'user', parts: [{ text: userText.trim() }] },
      ]

      // Optimistically add user message
      updateConversation(activeConvId, {
        messages: updatedMessages,
        geminiHistory: updatedGeminiHistory,
      })

      setIsLoading(true)
      try {
        // Send to Gemini with full history (for conversation memory)
        const aiText = await sendToGemini(userText.trim(), conv?.geminiHistory || [])

        const aiMsg = {
          id: `msg-${Date.now() + 1}`,
          role: 'model',
          content: aiText,
          timestamp: Date.now(),
        }

        const finalMessages = [...updatedMessages, aiMsg]
        const finalGeminiHistory = [
          ...updatedGeminiHistory,
          { role: 'model', parts: [{ text: aiText }] },
        ]

        let title = conv?.title
        // Auto-generate title after first user message
        if (conv?.messages?.length === 0) {
          title = await generateTitle(userText.trim())
        }

        updateConversation(activeConvId, {
          messages: finalMessages,
          geminiHistory: finalGeminiHistory,
          title,
        })
      } catch (err) {
        setError(err.message || 'Something went wrong. Please try again.')
        // Add error message to chat
        const errMsg = {
          id: `err-${Date.now()}`,
          role: 'error',
          content: err.message || 'Failed to get a response. Check your API key or try again.',
          timestamp: Date.now(),
        }
        updateConversation(activeConvId, {
          messages: [...updatedMessages, errMsg],
        })
      } finally {
        setIsLoading(false)
      }
    },
    [activeConvId, isLoading, getConversation, updateConversation]
  )

  const regenerate = useCallback(async () => {
    const conv = getConversation(activeConvId)
    if (!conv || conv.messages.length < 2 || isLoading) return

    // Find last user message
    const lastUserIdx = [...conv.messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserIdx === -1) return

    const realIdx = conv.messages.length - 1 - lastUserIdx
    const lastUserMsg = conv.messages[realIdx]
    const messagesUpToUser = conv.messages.slice(0, realIdx + 1)
    const historyUpToUser = conv.geminiHistory.slice(0, realIdx)

    updateConversation(activeConvId, { messages: messagesUpToUser })
    setIsLoading(true)
    setError(null)

    try {
      const aiText = await sendToGemini(lastUserMsg.content, historyUpToUser)
      const aiMsg = {
        id: `msg-${Date.now()}`,
        role: 'model',
        content: aiText,
        timestamp: Date.now(),
      }
      const freshHistory = [
        ...historyUpToUser,
        { role: 'user', parts: [{ text: lastUserMsg.content }] },
        { role: 'model', parts: [{ text: aiText }] },
      ]
      updateConversation(activeConvId, {
        messages: [...messagesUpToUser, aiMsg],
        geminiHistory: freshHistory,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [activeConvId, isLoading, getConversation, updateConversation])

  return { messages, isLoading, error, sendMessage, regenerate }
}