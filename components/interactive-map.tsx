"use client"

import { useEffect, useRef } from "react"

interface InteractiveMapProps {
  className?: string
  showTracking?: boolean
  clientLocation?: { lat: number; lng: number; accuracy?: number }
  ambulanceLocation?: { lat: number; lng: number; accuracy?: number }
}

export function InteractiveMap({
  className = "",
  showTracking = false,
  clientLocation = { lat: 42.3601, lng: -71.0589 },
  ambulanceLocation = { lat: 42.3565, lng: -71.0675 },
}: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pulsePhaseRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  const latToY = (lat: number, centerLat: number) => (centerLat - lat) * 4000
  const lngToX = (lng: number, centerLng: number) => (lng - centerLng) * 5000

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const centerLat = (clientLocation.lat + ambulanceLocation.lat) / 2
    const centerLng = (clientLocation.lng + ambulanceLocation.lng) / 2

    const draw = () => {
      // Background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#e8f0f7")
      gradient.addColorStop(1, "#d4e5f0")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = "#c0d5e8"
      ctx.lineWidth = 0.5
      for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 60) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      const clientX = centerX + lngToX(clientLocation.lng, centerLng)
      const clientY = centerY + latToY(clientLocation.lat, centerLat)

      // Animated pulse ring
      const pulse = Math.sin(pulsePhaseRef.current * 0.1) * 5 + 15
      ctx.strokeStyle = `rgba(37, 99, 235, ${Math.max(0.1, 0.5 - (pulsePhaseRef.current % 100) * 0.005)})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(clientX, clientY, pulse, 0, Math.PI * 2)
      ctx.stroke()

      // Client marker (blue)
      ctx.fillStyle = "#2563eb"
      ctx.beginPath()
      ctx.arc(clientX, clientY, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(clientX, clientY, 8, 0, Math.PI * 2)
      ctx.stroke()

      if (showTracking) {
        const ambulanceX = centerX + lngToX(ambulanceLocation.lng, centerLng)
        const ambulanceY = centerY + latToY(ambulanceLocation.lat, centerLat)

        // Route line
        ctx.strokeStyle = "#dc2626"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(clientX, clientY)
        ctx.lineTo(ambulanceX, ambulanceY)
        ctx.stroke()
        ctx.setLineDash([])

        // Ambulance marker (red)
        ctx.fillStyle = "#dc2626"
        ctx.beginPath()
        ctx.arc(ambulanceX, ambulanceY, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(ambulanceX, ambulanceY, 7, 0, Math.PI * 2)
        ctx.stroke()

        // Ambulance icon
        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("🚑", ambulanceX, ambulanceY)

        // Calculate distance and ETA
        const latDiff = ambulanceLocation.lat - clientLocation.lat
        const lngDiff = ambulanceLocation.lng - clientLocation.lng
        const distanceDegrees = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)
        const distanceMiles = distanceDegrees * 69
        const avgAmbulanceSpeed = 40
        const etaMinutes = Math.ceil((distanceMiles / avgAmbulanceSpeed) * 60)

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`${distanceMiles.toFixed(1)} mi`, ambulanceX, ambulanceY + 20)
        ctx.fillText(`ETA: ${etaMinutes} min`, ambulanceX, ambulanceY + 35)
      }

      // Client label
      ctx.fillStyle = "#2563eb"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("You", clientX, clientY - 20)

      pulsePhaseRef.current += 1
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    animationFrameRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [clientLocation, ambulanceLocation, showTracking])

  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden relative ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />

      {/* Location info overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 border border-blue-200 z-10">
        <p className="text-xs text-gray-500 font-semibold">YOUR LOCATION</p>
        <p className="text-sm font-bold text-gray-900">
          {clientLocation.lat.toFixed(4)}°N, {clientLocation.lng.toFixed(4)}°W
        </p>
        {clientLocation.accuracy && (
          <p className="text-xs text-gray-600">Accuracy: {Math.round(clientLocation.accuracy)}m</p>
        )}
      </div>

      {/* Ambulance info overlay */}
      {showTracking && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 border border-red-200 z-10">
          <p className="text-xs text-gray-500 font-semibold">AMBULANCE LOCATION</p>
          <p className="text-sm font-bold text-gray-900">
            {ambulanceLocation.lat.toFixed(4)}°N, {ambulanceLocation.lng.toFixed(4)}°W
          </p>
        </div>
      )}

      {/* Map legend */}
      {showTracking && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 border border-blue-200 z-10 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-700">Ambulance</span>
          </div>
        </div>
      )}
    </div>
  )
}
