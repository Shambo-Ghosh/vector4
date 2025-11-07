"use client"

import { useEffect, useState } from "react"
import { InteractiveMap } from "./interactive-map"
import { useLocationTracking } from "./location-tracker"

interface SOSConfirmationProps {
  onBack: () => void
}

export function SOSConfirmation({ onBack }: SOSConfirmationProps) {
  const [showMedicalInfo, setShowMedicalInfo] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [sosStage, setSosStage] = useState<"dispatched" | "en-route" | "arriving" | "arrived">("dispatched")
  const { clientLocation, ambulanceLocation } = useLocationTracking()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        if (newTime === 3) setSosStage("en-route")
        if (newTime === 8) setSosStage("arriving")
        if (newTime === 12) setSosStage("arrived")
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const medicalInfo = {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Hypertension"],
    medications: ["Lisinopril", "Albuterol Inhaler"],
    emergencyContact: "Mom - (555) 123-4567",
  }

  const calculateDistance = () => {
    const latDiff = ambulanceLocation.lat - clientLocation.lat
    const lngDiff = ambulanceLocation.lng - clientLocation.lng
    const distanceDegrees = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)
    const distanceMiles = distanceDegrees * 69
    return distanceMiles
  }

  const distance = calculateDistance()
  const etaMinutes = Math.max(1, Math.ceil((distance / 40) * 60))

  const getStageMessage = () => {
    switch (sosStage) {
      case "dispatched":
        return "Ambulance dispatched to your location"
      case "en-route":
        return "Ambulance is en route to you"
      case "arriving":
        return "Ambulance is arriving soon"
      case "arrived":
        return "Ambulance has arrived at your location"
      default:
        return ""
    }
  }

  const getStageIcon = () => {
    switch (sosStage) {
      case "dispatched":
        return "📍"
      case "en-route":
        return "🚑"
      case "arriving":
        return "⏰"
      case "arrived":
        return "✅"
      default:
        return ""
    }
  }

  const emergencyTeam = {
    unit: "Rescue Unit 7",
    eta: sosStage === "arrived" ? "Arrived" : `${etaMinutes} minutes`,
    status: getStageMessage(),
    crew: "Paramedics Johnson & Martinez",
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {sosStage === "arrived" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-auto">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in pointer-events-auto">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-5xl animate-bounce">
                ✅
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Help Has Arrived!</h2>
            <p className="text-muted-foreground mb-6">
              The ambulance team is here to assist you. Our paramedics {emergencyTeam.crew} are ready to provide
              emergency care.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800 font-medium">Unit: {emergencyTeam.unit}</p>
            </div>

            <button
              onClick={() => {
                console.log("[v0] Return to home clicked")
                onBack()
              }}
              className="w-full py-3 px-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition z-50 relative pointer-events-auto"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-accent text-accent-foreground p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">Emergency Response Active</h1>
            <p className="text-xs opacity-90">Status: {sosStage.charAt(0).toUpperCase() + sosStage.slice(1)}</p>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
              sosStage === "arrived" ? "bg-green-500 text-white animate-pulse" : "bg-accent-foreground/20 animate-spin"
            }`}
          >
            {getStageIcon()}
          </div>
        </div>
      </header>

      {/* Live Map */}
      <div className="h-48 relative overflow-hidden">
        <InteractiveMap showTracking={true} clientLocation={clientLocation} ambulanceLocation={ambulanceLocation} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Animated status timeline showing dispatch progress */}
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent rounded-lg p-4">
            <p className="text-xs text-muted-foreground font-semibold mb-4">DISPATCH STATUS</p>
            <div className="space-y-3">
              {["dispatched", "en-route", "arriving", "arrived"].map((stage, idx) => {
                const isActive = ["dispatched", "en-route", "arriving", "arrived"].indexOf(sosStage) >= idx
                const isCurrent = sosStage === stage
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                        isActive
                          ? isCurrent
                            ? "bg-accent text-accent-foreground animate-pulse"
                            : "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {isActive && isCurrent ? "●" : isActive ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground capitalize">{stage.replace("-", " ")}</p>
                      {isCurrent && <p className="text-xs text-muted-foreground">{emergencyTeam.status}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ETA Card */}
          <div className="bg-card border-2 border-accent rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground font-semibold">ESTIMATED ARRIVAL TIME</p>
              <div className="text-2xl">{getStageIcon()}</div>
            </div>
            <p className="text-4xl font-bold text-accent mb-1">{emergencyTeam.eta}</p>
            <p className="text-sm text-muted-foreground">{distance.toFixed(1)} miles away</p>
          </div>

          {/* Emergency Team Info */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm font-semibold text-muted-foreground mb-3">EMERGENCY TEAM</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Unit Number</p>
                <p className="font-semibold text-foreground">{emergencyTeam.unit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Crew</p>
                <p className="font-semibold text-foreground">{emergencyTeam.crew}</p>
              </div>
            </div>
          </div>

          {/* Medical Information Card */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowMedicalInfo(!showMedicalInfo)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">💊</div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-muted-foreground">MEDICAL INFORMATION</p>
                  <p className="text-xs text-muted-foreground">Blood Type: {medicalInfo.bloodType}</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-muted-foreground transition ${showMedicalInfo ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Expandable Medical Info */}
            {showMedicalInfo && (
              <div className="border-t border-border p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">ALLERGIES</p>
                  <div className="flex flex-wrap gap-2">
                    {medicalInfo.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">CHRONIC CONDITIONS</p>
                  <div className="space-y-1">
                    {medicalInfo.conditions.map((condition) => (
                      <p key={condition} className="text-sm text-foreground">
                        • {condition}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">CURRENT MEDICATIONS</p>
                  <div className="space-y-1">
                    {medicalInfo.medications.map((med) => (
                      <p key={med} className="text-sm text-foreground">
                        • {med}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">PRIMARY EMERGENCY CONTACT</p>
                  <p className="text-sm text-foreground font-medium">{medicalInfo.emergencyContact}</p>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-3">AVAILABLE ACTIONS</p>
            <div className="space-y-2">
              <button className="w-full p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.58 1.745 2.708 4.814 4.54 5.978l.772-1.545a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Emergency Services
              </button>
              <button className="w-full p-3 bg-white border border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                Message Emergency Contacts
              </button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-3">STAY SAFE UNTIL HELP ARRIVES</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Keep your phone nearby and answer calls from responders</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Unlock your door if safe and possible</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Do not move unless in immediate danger</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Your location is being tracked in real-time</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
          >
            Back to Home
          </button>
          <button className="flex-1 py-3 px-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition">
            Update Status
          </button>
        </div>
      </div>
    </div>
  )
}
