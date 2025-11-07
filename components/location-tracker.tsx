"use client"

import { useEffect, useState } from "react"

interface LocationData {
  lat: number
  lng: number
  accuracy?: number
}

export function useLocationTracking() {
  const [clientLocation, setClientLocation] = useState<LocationData>({
    lat: 42.3601,
    lng: -71.0589,
  })
  const [ambulanceLocation, setAmbulanceLocation] = useState<LocationData>({
    lat: 42.3565,
    lng: -71.0675,
  })

  // Get user's actual location
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setClientLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          })
        },
        (error) => {
          console.log("[v0] Geolocation error:", error.message)
          // Keep default location if permission denied
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 5000,
        },
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  // Simulate ambulance movement toward client
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulanceLocation((prev) => {
        const latDiff = clientLocation.lat - prev.lat
        const lngDiff = clientLocation.lng - prev.lng
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)

        // If ambulance is close enough to client (within ~0.0005 degrees ≈ 50m), stop moving
        if (distance < 0.0005) {
          return prev
        }

        // Move ambulance 10% closer each second
        const moveSpeed = 0.1
        return {
          lat: prev.lat + latDiff * moveSpeed,
          lng: prev.lng + lngDiff * moveSpeed,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [clientLocation])

  return { clientLocation, ambulanceLocation }
}
