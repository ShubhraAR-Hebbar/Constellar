import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'nova_conversations'

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveConversations(convs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
  } catch {
    console.warn('Could not save conversations to localStorage.')
  }
}

/**
 * useConversations — manages full conversation list in localStorage
 * Each conversation: { id, title, createdAt, updatedAt, messages: [] }
 */
export function useConversations() {
  const [conversations, setConversations] = useState(loadConversations)

  // Persist whenever conversations change
  useEffect(() => {
    saveConversations(conversations)
  }, [conversations])

  const createConversation = useCallback(() => {
    const id = `conv-${Date.now()}`
    const newConv = {
      id,
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      geminiHistory: [], // Gemini format: [{role,parts}]
    }
    setConversations((prev) => [newConv, ...prev])
    return id
  }, [])

  const updateConversation = useCallback((id, updates) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c))
    )
  }, [])

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getConversation = useCallback(
    (id) => conversations.find((c) => c.id === id) || null,
    [conversations]
  )

  const clearAll = useCallback(() => {
    setConversations([])
  }, [])

  return {
    conversations,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversation,
    clearAll,
  }
}