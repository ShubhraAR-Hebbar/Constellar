import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Bot, User, Copy, Check, AlertTriangle } from 'lucide-react'

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)
  const lang = className?.replace('language-', '') || 'code'
  const code = String(children).replace(/\n$/, '')

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(125,216,255,0.15)' }}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 text-[11px] font-mono"
        style={{ background: 'rgba(8,13,35,0.95)', borderBottom: '1px solid rgba(125,216,255,0.1)' }}
      >
        <span className="text-cyan-400/70">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      {/* Code */}
      <pre
        className="overflow-x-auto p-4 text-[13px] leading-relaxed m-0"
        style={{ background: 'rgba(5,6,15,0.9)' }}
      >
        <code className={className}>{code}</code>
      </pre>
    </div>
  )
}

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded text-[12px] font-mono"
          style={{
            background: 'rgba(125,216,255,0.1)',
            border: '1px solid rgba(125,216,255,0.2)',
            color: '#7dd8ff',
          }}
          {...props}
        >
          {children}
        </code>
      )
    }
    return <CodeBlock className={className}>{children}</CodeBlock>
  },
  p({ children }) {
    return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  },
  ul({ children }) {
    return <ul className="list-none space-y-1 my-2 pl-1">{children}</ul>
  },
  ol({ children }) {
    return <ol className="list-decimal list-inside space-y-1 my-2 pl-1">{children}</ol>
  },
  li({ children }) {
    return (
      <li className="flex items-start gap-2">
        <span className="text-cyan-400 mt-1 text-[10px] shrink-0">◈</span>
        <span>{children}</span>
      </li>
    )
  },
  strong({ children }) {
    return <strong className="font-semibold text-white">{children}</strong>
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
      >
        {children}
      </a>
    )
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto my-3">
        <table
          className="w-full text-[13px] border-collapse"
          style={{ border: '1px solid rgba(125,216,255,0.15)' }}
        >
          {children}
        </table>
      </div>
    )
  },
  th({ children }) {
    return (
      <th
        className="px-3 py-2 text-left font-semibold text-cyan-300 text-[12px]"
        style={{ background: 'rgba(125,216,255,0.08)', borderBottom: '1px solid rgba(125,216,255,0.15)' }}
      >
        {children}
      </th>
    )
  },
  td({ children }) {
    return (
      <td
        className="px-3 py-2 text-slate-300"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {children}
      </td>
    )
  },
  blockquote({ children }) {
    return (
      <blockquote
        className="pl-4 my-2 text-slate-400 italic"
        style={{ borderLeft: '3px solid rgba(125,216,255,0.4)' }}
      >
        {children}
      </blockquote>
    )
  },
  h1({ children }) { return <h1 className="text-xl font-bold text-white mt-4 mb-2">{children}</h1> },
  h2({ children }) { return <h2 className="text-lg font-semibold text-white mt-3 mb-2">{children}</h2> },
  h3({ children }) { return <h3 className="text-base font-semibold text-slate-200 mt-2 mb-1">{children}</h3> },
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isError = message.role === 'error'
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex items-start gap-3 px-4 py-2 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
            : isError
            ? 'bg-red-500/15 border border-red-500/25 text-red-400'
            : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
        }`}
        style={!isUser && !isError ? {
          background: 'linear-gradient(135deg, rgba(125,216,255,0.15), rgba(179,136,255,0.15))',
        } : {}}
      >
        {isUser ? <User size={15} /> : isError ? <AlertTriangle size={15} /> : <Bot size={15} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
            isUser
              ? 'text-white rounded-tr-sm'
              : isError
              ? 'text-red-300 rounded-tl-sm'
              : 'text-slate-200 rounded-tl-sm'
          }`}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #0e6edf, #0ea5e9)',
                  boxShadow: '0 4px 16px rgba(14,110,223,0.25)',
                }
              : isError
              ? {
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }
              : {
                  background: 'rgba(15,23,42,0.8)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }
          }
        >
          {isUser || isError ? (
            <span className="whitespace-pre-wrap">{message.content}</span>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <span className="text-[10px] font-mono text-slate-500 px-1">{time}</span>
      </div>
    </div>
  )
}