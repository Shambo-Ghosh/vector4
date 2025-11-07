"use client"
import { X, Heart, AlertCircle, FileText, Clock } from "lucide-react"

interface MedicalProfile {
  id: string
  name: string
  age: number
  bloodType: string
  allergies: string[]
  medications: string[]
  conditions: string[]
  emergencyContact: string
  contactPhone: string
}

interface MedicalProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MedicalProfileModal({ isOpen, onClose }: MedicalProfileModalProps) {
  const sampleProfiles: MedicalProfile[] = [
    {
      id: "1",
      name: "John Smith",
      age: 45,
      bloodType: "O+",
      allergies: ["Penicillin", "Nuts"],
      medications: ["Lisinopril", "Aspirin"],
      conditions: ["Hypertension", "Type 2 Diabetes"],
      emergencyContact: "Sarah Smith (Spouse)",
      contactPhone: "+1-555-0101",
    },
    {
      id: "2",
      name: "Emily Johnson",
      age: 32,
      bloodType: "A+",
      allergies: ["Latex", "Sulfa drugs"],
      medications: ["Levothyroxine"],
      conditions: ["Hypothyroidism"],
      emergencyContact: "Michael Johnson (Brother)",
      contactPhone: "+1-555-0102",
    },
    {
      id: "3",
      name: "Robert Williams",
      age: 68,
      bloodType: "B-",
      allergies: ["Codeine"],
      medications: ["Metoprolol", "Atorvastatin", "Metformin"],
      conditions: ["Heart Disease", "Hypertension", "Diabetes"],
      emergencyContact: "Jennifer Williams (Daughter)",
      contactPhone: "+1-555-0103",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Medical Profiles</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profiles */}
        <div className="p-6 space-y-4">
          {sampleProfiles.map((profile) => (
            <div
              key={profile.id}
              className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow bg-slate-50"
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Age: {profile.age} • Blood Type: <span className="font-bold text-accent">{profile.bloodType}</span>
                  </p>
                </div>
              </div>

              {/* Medical Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Blood Type & Allergies */}
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="font-semibold text-sm text-foreground">Allergies</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.length > 0 ? (
                      profile.allergies.map((allergy, idx) => (
                        <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </div>
                </div>

                {/* Medications */}
                <div className="bg-white p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <p className="font-semibold text-sm text-foreground">Medications</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.medications.length > 0 ? (
                      profile.medications.map((med, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                        >
                          {med}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </div>
                </div>

                {/* Conditions */}
                <div className="bg-white p-3 rounded-lg border border-slate-100 col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <p className="font-semibold text-sm text-foreground">Medical Conditions</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.conditions.length > 0 ? (
                      profile.conditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-4 pt-4 border-t border-slate-200 bg-white rounded-lg p-3 flex items-start gap-3">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm text-foreground">{profile.emergencyContact}</p>
                  <p className="text-xs text-muted-foreground">{profile.contactPhone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
          <p className="text-xs text-muted-foreground">
            These are sample public medical profiles. Personal profiles are encrypted and private.
          </p>
        </div>
      </div>
    </div>
  )
}
