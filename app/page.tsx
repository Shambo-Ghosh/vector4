"use client"

import { useState } from "react"
import { HomePage } from "@/components/home-page"
import { BookingForm, type BookingData } from "@/components/booking-form"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { SOSOverlay } from "@/components/sos-overlay"
import { SOSConfirmation } from "@/components/sos-confirmation"
import { ChatBot } from "@/components/chatbot"
import { AIEmergencyChat } from "@/components/ai-emergency-chat"

export default function Page() {
  const [view, setView] = useState<"home" | "booking-form" | "booking-confirmation" | "sos-confirmation">("home")
  const [showSOSCountdown, setShowSOSCountdown] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showEmergencyChat, setShowEmergencyChat] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  const handleBookingSubmit = (data: BookingData) => {
    setBookingData(data)
    setView("booking-confirmation")
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Home Screen */}
      {view === "home" && (
        <HomePage
          onBookAmbulance={() => setView("booking-form")}
          onSOS={() => setShowSOSCountdown(true)}
          onAIChat={() => setShowChat(true)}
        />
      )}

      {/* Booking Form */}
      {view === "booking-form" && <BookingForm onConfirm={handleBookingSubmit} onCancel={() => setView("home")} />}

      {/* Booking Confirmation */}
      {view === "booking-confirmation" && <BookingConfirmation onBack={() => setView("home")} />}

      {/* SOS Confirmation */}
      {view === "sos-confirmation" && <SOSConfirmation onBack={() => setView("home")} />}

      {/* SOS Countdown Overlay */}
      {showSOSCountdown && (
        <SOSOverlay
          onConfirm={() => {
            setView("sos-confirmation")
            setShowSOSCountdown(false)
            setShowEmergencyChat(true)
          }}
          onCancel={() => setShowSOSCountdown(false)}
        />
      )}

      {/* Regular Chatbot */}
      {showChat && !showEmergencyChat && <ChatBot onClose={() => setShowChat(false)} />}

      {/* AI Emergency Chat */}
      {showEmergencyChat && <AIEmergencyChat onClose={() => setShowEmergencyChat(false)} emergencyType="medical" />}

      {/* Floating Chat Button */}
      {!showChat && !showEmergencyChat && view !== "sos-confirmation" && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </main>
  )
}
