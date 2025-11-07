"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

interface AIEmergencyChatProps {
  onClose: () => void
  emergencyType?: string
}

export function AIEmergencyChat({ onClose, emergencyType }: AIEmergencyChatProps) {
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    transport: new DefaultChatTransport({ api: "/api/emergency-chat" }),
    initialMessages: emergencyType
      ? [
          {
            id: "1",
            role: "assistant",
            content: `I'm here to help with your ${emergencyType} emergency. Can you tell me more details about what's happening?`,
          },
        ]
      : [
          {
            id: "1",
            role: "assistant",
            content:
              "I'm AmbuQuick's AI Emergency Assistant. I'm here 24/7 to help guide you through medical emergencies. What's happening right now?",
          },
        ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages.length])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    handleSubmit(e)
    handleInputChange({ target: { value: "" } } as any)
    setIsLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden z-50 h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="bg-red-600 text-white p-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-bold text-base">Emergency AI Assistant</h3>
          <p className="text-xs opacity-90">Real-time Guidance</p>
        </div>
        <button onClick={onClose} className="text-white hover:opacity-80 transition p-1" aria-label="Close chat">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-background">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-red-50 text-foreground rounded-bl-none border border-red-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-red-50 text-foreground px-4 py-2 rounded-lg rounded-bl-none border border-red-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-border p-3 flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Describe your emergency..."
          className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-600"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7-9 7 9 7z" />
          </svg>
        </button>
      </form>

      {/* Emergency Banner */}
      <div className="bg-red-100 text-red-900 px-4 py-2 text-xs text-center border-t border-red-200">
        For life-threatening emergencies, call 911 or use SOS immediately
      </div>
    </div>
  )
}
