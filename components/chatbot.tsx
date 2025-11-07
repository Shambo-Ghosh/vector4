"use client"

import { useState, useRef, useEffect, useMemo } from "react"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  text: string
  quickReplies?: string[]
  category?: string
}

interface ChatBotProps {
  onClose: () => void
}

const CHATBOT_RESPONSES: Record<string, string> = {
  greeting: "Hello! I'm AmbuQuick assistant. How can I help you today?",

  // Booking Related
  book_ambulance:
    "I can help you book an ambulance. Would you like to book a standard ambulance now, or do you need information about our services first?",
  ambulance_types:
    "We offer three types of ambulances:\n• BLS (Basic Life Support) - $150 for stable patients\n• ALS (Advanced Life Support) - $250 for critical patients\n• Specialized Transport - $400 for special equipment needs\n\nWhich would work best for you?",
  bls: "Basic Life Support ambulance selected. BLS is ideal for non-critical patients with stable conditions. Our BLS units are equipped with oxygen, defibrillators, and trained EMTs.",
  als: "Advanced Life Support selected. ALS provides advanced medical equipment, medications, and paramedics trained in advanced procedures. Perfect for critical situations.",
  specialized:
    "Specialized Transport selected. This includes NICU transport, bariatric units, and specialized equipment. Ideal for complex medical needs.",

  // Emergency Related
  emergency_info:
    "In a true life-threatening emergency, always call 911 immediately. Our SOS feature is an additional resource that will dispatch emergency responders to your location.",
  when_use_sos:
    "Use our SOS feature when you need immediate emergency assistance but cannot reach 911, or to get additional medical response. Your location will be instantly shared with responders.",

  // Location & Booking
  address:
    "To book an ambulance, I need to confirm your location. Is your current location accurate? You can also update it in the app.",
  location_sharing:
    "Your location is safely shared only with emergency responders during an active booking or SOS activation. We never share your location otherwise.",

  // Payment
  payment_options:
    "We accept multiple payment methods:\n• Insurance (billing to your insurance)\n• Cash Payment on service\n• Credit/Debit Card online\n• Mobile payment apps\n\nWhich works best for you?",
  insurance:
    "Insurance payment selected. We'll bill your insurance provider. Make sure your insurance information is up to date in your profile.",
  cash: "Cash payment selected. You'll pay the driver upon arrival. Receipts will be provided for insurance filing.",
  card: "Credit/Debit card payment selected. Your card will be securely charged after service completion.",

  // Health & Safety
  medical_info:
    "Your medical profile helps responders provide better care. You can update your blood type, allergies, medications, and emergency contacts in your profile.",
  allergies_important:
    "Allergies are critical information. Please make sure your allergy information is current - especially medication allergies. This helps paramedics choose safe treatments.",
  conditions:
    "Listing your chronic conditions helps us provide specialized care. Common conditions include asthma, diabetes, heart conditions, and hypertension.",

  // Emergencies & Safety
  pregnant:
    "If you're pregnant and experiencing an emergency, our ALS units are equipped for obstetric emergencies. Please select ALS and note 'pregnant' in special requests.",
  chest_pain:
    "Chest pain is a serious emergency symptom. Please select 'Chest Pain' as your condition and consider using our SOS feature for fastest response.",
  difficulty_breathing:
    "Difficulty breathing requires immediate attention. Select 'Difficulty Breathing' and ALS ambulance type. Our paramedics are trained in airway management.",
  allergic_reaction:
    "Severe allergic reactions require urgent care. Our ALS units carry epinephrine and antihistamines. Please mention any known allergies.",
  trauma:
    "For trauma or accidents, our Specialized Transport units are equipped with trauma packages. ETA varies by location. Always call 911 for life-threatening trauma.",
  unconscious:
    "An unconscious patient requires immediate emergency response. Please use our SOS feature immediately and follow dispatcher instructions.",

  // General Help
  faq: "Common questions:\n• How do I update my profile?\n• What's the difference between booking types?\n• How do I cancel a booking?\n• Where can I see my ambulance in real-time?\n\nWhich would help you?",
  cancel_booking:
    "You can cancel a booking up to 5 minutes before the ambulance arrives. After that, a cancellation fee may apply. Go to 'Active Bookings' to cancel.",
  eta: "Your ambulance's ETA is shown in real-time on the map. It updates as the ambulance approaches. You can also call the driver for updates.",

  default:
    "I'm here to help! You can ask about:\n• Booking an ambulance\n• Payment options\n• Medical information\n• Emergency services\n• Account help\n\nWhat would you like to know?",
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      text: CHATBOT_RESPONSES.greeting,
      quickReplies: ["Book Ambulance", "Emergency Info", "Payment & Pricing", "Medical Profile", "FAQs"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, isTyping])

  const generateBotResponse = (userText: string): { response: string; quickReplies?: string[] } => {
    const lowerText = userText.toLowerCase().trim()

    // Emergency Keywords
    if (lowerText.includes("emergency") && (lowerText.includes("info") || lowerText.includes("what"))) {
      return {
        response: CHATBOT_RESPONSES.emergency_info,
        quickReplies: ["When should I use SOS?", "Call 911", "Back"],
      }
    }
    if (lowerText.includes("sos") || (lowerText.includes("when") && lowerText.includes("emergency"))) {
      return { response: CHATBOT_RESPONSES.when_use_sos, quickReplies: ["Activate SOS Now", "More Info", "Back"] }
    }

    // Booking Keywords
    if (lowerText.includes("book") || lowerText.includes("ambulance")) {
      if (lowerText.includes("type") || lowerText.includes("which")) {
        return {
          response: CHATBOT_RESPONSES.ambulance_types,
          quickReplies: ["BLS Info", "ALS Info", "Specialized Info"],
        }
      }
      return { response: CHATBOT_RESPONSES.book_ambulance, quickReplies: ["Book Now", "Learn More", "Cancel"] }
    }
    if (lowerText.includes("bls")) {
      return { response: CHATBOT_RESPONSES.bls, quickReplies: ["Select BLS", "See Other Types", "Back"] }
    }
    if (lowerText.includes("als") || lowerText.includes("advanced")) {
      return { response: CHATBOT_RESPONSES.als, quickReplies: ["Select ALS", "See Other Types", "Back"] }
    }
    if (lowerText.includes("specialized") || lowerText.includes("critical")) {
      return {
        response: CHATBOT_RESPONSES.specialized,
        quickReplies: ["Select Specialized", "See Other Types", "Back"],
      }
    }

    // Payment Keywords
    if (lowerText.includes("payment") || lowerText.includes("pay") || lowerText.includes("cost")) {
      return { response: CHATBOT_RESPONSES.payment_options, quickReplies: ["Insurance", "Cash", "Card", "Back"] }
    }
    if (lowerText.includes("insurance")) {
      return { response: CHATBOT_RESPONSES.insurance, quickReplies: ["Select Insurance", "Other Payment", "Back"] }
    }
    if (lowerText.includes("cash")) {
      return { response: CHATBOT_RESPONSES.cash, quickReplies: ["Select Cash", "Other Payment", "Back"] }
    }
    if (lowerText.includes("card") || lowerText.includes("credit") || lowerText.includes("debit")) {
      return { response: CHATBOT_RESPONSES.card, quickReplies: ["Select Card", "Other Payment", "Back"] }
    }

    // Medical Information Keywords
    if (lowerText.includes("medical") || lowerText.includes("health") || lowerText.includes("profile")) {
      return {
        response: CHATBOT_RESPONSES.medical_info,
        quickReplies: ["Update Allergies", "Add Conditions", "Emergency Contacts", "Back"],
      }
    }
    if (lowerText.includes("allerg")) {
      return { response: CHATBOT_RESPONSES.allergies_important, quickReplies: ["Update Now", "More Info", "Back"] }
    }
    if (lowerText.includes("condition")) {
      return { response: CHATBOT_RESPONSES.conditions, quickReplies: ["Add Condition", "View Profile", "Back"] }
    }

    // Specific Health Emergencies
    if (lowerText.includes("pregnant")) {
      return { response: CHATBOT_RESPONSES.pregnant, quickReplies: ["Book ALS", "Emergency Info", "Back"] }
    }
    if (lowerText.includes("chest") && lowerText.includes("pain")) {
      return { response: CHATBOT_RESPONSES.chest_pain, quickReplies: ["Get Help Now", "SOS", "More Info"] }
    }
    if (lowerText.includes("breath") || lowerText.includes("breathing")) {
      return { response: CHATBOT_RESPONSES.difficulty_breathing, quickReplies: ["Get Help Now", "SOS", "Call 911"] }
    }
    if (lowerText.includes("allergic") || lowerText.includes("reaction")) {
      return { response: CHATBOT_RESPONSES.allergic_reaction, quickReplies: ["SOS Now", "Book ALS", "Call 911"] }
    }
    if ((lowerText.includes("trauma") || lowerText.includes("accident")) && lowerText.includes("emergency")) {
      return { response: CHATBOT_RESPONSES.trauma, quickReplies: ["Call 911", "SOS", "More Info"] }
    }
    if (lowerText.includes("unconscious") || (lowerText.includes("pass") && lowerText.includes("out"))) {
      return { response: CHATBOT_RESPONSES.unconscious, quickReplies: ["SOS Now", "Call 911", "More Help"] }
    }

    // Location Keywords
    if (lowerText.includes("address") || lowerText.includes("location")) {
      return { response: CHATBOT_RESPONSES.address, quickReplies: ["Confirm", "Update Location", "Back"] }
    }
    if (lowerText.includes("location") && lowerText.includes("sharing")) {
      return { response: CHATBOT_RESPONSES.location_sharing, quickReplies: ["Understand", "Privacy", "Back"] }
    }

    // General Help & FAQs
    if (lowerText.includes("faq") || lowerText.includes("help") || lowerText.includes("question")) {
      return { response: CHATBOT_RESPONSES.faq, quickReplies: ["Update Profile", "Booking Types", "Cancel", "Track"] }
    }
    if (lowerText.includes("cancel")) {
      return { response: CHATBOT_RESPONSES.cancel_booking, quickReplies: ["Cancel Booking", "Why Fee?", "Back"] }
    }
    if (lowerText.includes("eta") || lowerText.includes("arrival") || lowerText.includes("time")) {
      return { response: CHATBOT_RESPONSES.eta, quickReplies: ["Track Ambulance", "Contact Driver", "Back"] }
    }

    // Default response
    return {
      response: CHATBOT_RESPONSES.default,
      quickReplies: ["Book Ambulance", "Emergency Info", "Payment & Pricing", "Medical Profile", "FAQs"],
    }
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot typing
    setIsTyping(true)
    const timeoutId = setTimeout(() => {
      const { response, quickReplies } = generateBotResponse(text)

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response,
        quickReplies,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 800)

    return () => clearTimeout(timeoutId)
  }

  const lastMessage = useMemo(() => messages[messages.length - 1], [messages])

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden z-50 h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-bold text-base">AmbuQuick Assistant</h3>
          <p className="text-xs opacity-90">24/7 Support</p>
        </div>
        <button onClick={onClose} className="text-primary-foreground hover:opacity-80 transition p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.type === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {lastMessage?.quickReplies && (
        <div className="px-4 pb-3 flex gap-2 flex-wrap flex-shrink-0">
          {lastMessage.quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSendMessage(reply)}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium hover:bg-muted transition"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3 flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim()}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7-9 7 9 7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
