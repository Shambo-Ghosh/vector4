"use client"

import { useState, useEffect, useRef } from "react"

interface SOSOverlayProps {
  onConfirm: () => void
  onCancel: () => void
}

export function SOSOverlay({ onConfirm, onCancel }: SOSOverlayProps) {
  const [countdown, setCountdown] = useState(10)
  const [phase, setPhase] = useState<"warning" | "triggered" | "dispatched">("warning")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const previousCountdownRef = useRef(10)
  const audioContextRef = useRef<AudioContext | null>(null)

  const emergencyContacts = [
    { id: "1", name: "Emergency Dispatch", icon: "🚨", selected: true },
    { id: "2", name: "Family - Mom", icon: "👩", selected: false },
    { id: "3", name: "Friend - John", icon: "👨", selected: false },
    { id: "4", name: "Workplace - HR", icon: "🏢", selected: false },
  ]

  const medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Hypertension"],
    medications: ["Lisinopril", "Albuterol Inhaler"],
    emergencyContact: "Mom - (555) 123-4567",
  }

  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 1000 // 1000 Hz frequency for loud beep
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime) // Loud volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2) // Quick decay

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.2) // 200ms beep duration
    } catch (error) {
      console.error("Error playing beep:", error)
    }
  }

  useEffect(() => {
    if (countdown === 0 && phase === "warning") {
      setPhase("triggered")
      setCountdown(3)
      previousCountdownRef.current = 3
      playBeep() // Final beep before transition
      return
    }

    if (countdown === 0 && phase === "triggered") {
      setPhase("dispatched")
      onConfirm()
      return
    }

    if (countdown !== previousCountdownRef.current) {
      playBeep()
      previousCountdownRef.current = countdown
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, phase, onConfirm])

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  if (phase === "warning") {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center animate-in">
          {/* Warning Icon - Pulsing */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center animate-pulse-red">
                <svg className="w-14 h-14 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 border-2 border-accent rounded-full animate-countdown opacity-40"></div>
            </div>
          </div>

          {/* Countdown Display */}
          <div className="mb-6">
            <p className="text-6xl font-bold text-accent mb-3 animate-countdown tabular-nums">
              {countdown.toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-muted-foreground">seconds until emergency dispatch</p>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-foreground mb-2">Emergency SOS Activated</h2>
          <p className="text-muted-foreground mb-6">
            Your location is being shared with emergency services. Tap Cancel to abort.
          </p>

          {/* Contact Selection */}
          <div className="bg-muted p-4 rounded-lg mb-6 text-left">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Notify Contacts</p>
            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactToggle(contact.id)}
                  className={`w-full p-2 rounded-lg flex items-center gap-2 transition ${
                    selectedContacts.includes(contact.id) || contact.selected
                      ? "bg-primary/20 border border-primary"
                      : "border border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id) || contact.selected}
                    onChange={() => handleContactToggle(contact.id)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-lg">{contact.icon}</span>
                  <span className="text-sm font-medium text-foreground flex-1 text-left">{contact.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="w-full py-4 px-4 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition"
          >
            Cancel SOS
          </button>
        </div>
      </div>
    )
  }

  if (phase === "triggered") {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-8 max-w-sm w-full text-center">
          {/* Triggering Animation */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-14 h-14 text-accent-foreground animate-bounce"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Dispatching Emergency Services</h2>
          <p className="text-muted-foreground mb-2">Connecting you with nearest responders...</p>
          <p className="text-sm text-accent font-semibold">{countdown} seconds</p>
        </div>
      </div>
    )
  }

  return <div></div>
}
