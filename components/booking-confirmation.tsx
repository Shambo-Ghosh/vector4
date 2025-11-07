"use client"

import { useState } from "react"
import { InteractiveMap } from "./interactive-map"
import { useLocationTracking } from "./location-tracker"

interface BookingConfirmationProps {
  onBack: () => void
}

export function BookingConfirmation({ onBack }: BookingConfirmationProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const { clientLocation, ambulanceLocation } = useLocationTracking()

  const driver = {
    name: "Rajesh Kumar",
    rating: 4.8,
    photo: "/paramedic-portrait.jpg",
  }

  const vehicle = {
    type: "Advanced Life Support (ALS)",
    number: "AMB-2024-341",
    eta: "8 minutes",
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center gap-3">
        <button onClick={onBack} className="text-primary hover:opacity-80 transition" aria-label="Go back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="font-bold text-lg text-foreground">Booking Status</h1>
          <p className="text-xs text-green-600 font-semibold">Confirmed</p>
        </div>
      </header>

      {/* Status Card */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ETA to Your Location</p>
            <p className="text-2xl font-bold text-foreground">{vehicle.eta}</p>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="bg-card border-b border-border p-4">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Driver Details</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              RK
            </div>
            <div>
              <p className="font-semibold text-foreground">{driver.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-foreground">⭐ {driver.rating}</span>
              </div>
            </div>
          </div>
          <button className="text-primary hover:opacity-80 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.048 1.029a11.04 11.04 0 01-5.516 5.516l-1.029-2.048a1 1 0 00-.756-.502l-4.493-1.498a1 1 0 00-.684-.948V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-card border-b border-border p-4">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Vehicle Information</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Type:</span>
            <span className="text-sm font-semibold text-foreground">{vehicle.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Vehicle Number:</span>
            <span className="text-sm font-semibold text-foreground">{vehicle.number}</span>
          </div>
        </div>
      </div>

      {/* Location Tracker */}
      <div className="bg-card border-b border-border p-4 flex-1">
        <p className="text-sm font-semibold text-muted-foreground mb-3">Live Tracking</p>
        <div className="w-full h-60 rounded-lg overflow-hidden border border-border mb-4">
          <InteractiveMap showTracking={true} clientLocation={clientLocation} ambulanceLocation={ambulanceLocation} />
        </div>

        {/* Your Location */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-blue-900">YOUR LOCATION</p>
          </div>
          <p className="text-xs text-gray-700 mb-1">
            {clientLocation.lat.toFixed(4)}°, {clientLocation.lng.toFixed(4)}°
          </p>
          {clientLocation.accuracy && (
            <p className="text-xs text-gray-600">Accuracy: {Math.round(clientLocation.accuracy)}m</p>
          )}
        </div>

        {/* Ambulance Location */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <p className="text-xs font-semibold text-red-900">AMBULANCE</p>
          </div>
          <p className="text-xs text-gray-700 mb-1">
            {ambulanceLocation.lat.toFixed(4)}°, {ambulanceLocation.lng.toFixed(4)}°
          </p>
          <p className="text-xs text-gray-600">En route to you</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
          Track Ambulance
        </button>
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="w-full py-3 px-4 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
        >
          Cancel Booking
        </button>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-card w-full rounded-t-2xl p-6 border-t border-border animate-in">
            <h2 className="text-lg font-bold text-foreground mb-2">Cancel Booking?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. Your driver will be notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-3 px-4 border border-border rounded-lg font-semibold hover:bg-muted transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false)
                  onBack()
                }}
                className="flex-1 py-3 px-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
