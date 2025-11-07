"use client"
import { useState } from "react"
import { useLocationTracking } from "./location-tracker"
import { SirenLightLogo } from "./siren-light-logo"
import { MedicalProfileModal } from "./medical-profile-modal"
import { Activity, Heart, MessageCircle, Navigation, Clock } from "lucide-react"

interface HomePageProps {
  onBookAmbulance: () => void
  onSOS: () => void
  onAIChat: () => void
}

export function HomePage({ onBookAmbulance, onSOS, onAIChat }: HomePageProps) {
  const { clientLocation } = useLocationTracking()
  const [showMedicalProfiles, setShowMedicalProfiles] = useState(false)

  const services = [
    {
      id: 1,
      icon: Activity,
      title: "SOS Emergency",
      description: "Instant emergency dispatch with immediate response",
      color: "from-red-500 to-red-600",
      action: onSOS,
      delay: "0s",
    },
    {
      id: 2,
      icon: Clock,
      title: "Quick Booking",
      description: "Schedule ambulance in minutes with easy booking",
      color: "from-blue-500 to-blue-600",
      action: onBookAmbulance,
      delay: "0.1s",
    },
    {
      id: 3,
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "24/7 AI assistant for medical emergency guidance",
      color: "from-purple-500 to-purple-600",
      action: onAIChat,
      delay: "0.2s",
    },
    {
      id: 4,
      icon: Navigation,
      title: "Real-time Tracking",
      description: "Live location tracking of ambulance arrival",
      color: "from-green-500 to-green-600",
      action: () => {},
      delay: "0.3s",
    },
    {
      id: 5,
      icon: Heart,
      title: "Medical Profile",
      description: "Securely store medical history and allergies",
      color: "from-pink-500 to-pink-600",
      action: () => setShowMedicalProfiles(true),
      delay: "0.4s",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between animate-slide-down shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <SirenLightLogo />
            <div>
              <h1 className="text-2xl font-bold text-accent">AmbuQuick</h1>
              <p className="text-xs text-muted-foreground">Emergency Response</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current Location</p>
            <p className="text-sm font-semibold text-foreground">Downtown Area</p>
          </div>
        </header>

        {/* Hero Section */}
        <div className="px-4 py-8 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Fast. Reliable. Life-Saving.</h2>
          <p className="text-lg text-muted-foreground mb-8">Emergency ambulance service at your fingertips</p>
        </div>

        {/* Services Grid */}
        <div className="px-4 pb-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  onClick={service.action}
                  style={{ animationDelay: service.delay }}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer animate-slide-up hover:scale-105 active:scale-95"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {service.description}
                    </p>
                  </div>

                  {/* Hover accent line */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${service.color} w-0 group-hover:w-full transition-all duration-300`}
                  ></div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 safe-bottom sticky bottom-0 z-20">
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              onClick={onBookAmbulance}
              className="py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-md group cursor-pointer animate-scale-bounce"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
                <span>Book Now</span>
              </div>
            </button>

            <button
              onClick={onSOS}
              className="py-3 px-4 bg-accent text-accent-foreground rounded-lg font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg animate-pulse-red animate-glow-pulse group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="flex items-center justify-center gap-2 relative z-10 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
                <span>SOS</span>
              </div>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-xs text-center text-muted-foreground">
              Emergency services available 24/7 • Response time may vary
            </p>
          </div>
        </div>
      </div>

      <MedicalProfileModal isOpen={showMedicalProfiles} onClose={() => setShowMedicalProfiles(false)} />
    </div>
  )
}
