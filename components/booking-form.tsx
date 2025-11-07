"use client"

import { useState } from "react"

interface BookingFormProps {
  onConfirm: (bookingData: BookingData) => void
  onCancel: () => void
}

export interface BookingData {
  ambulanceType: "basic" | "als" | "specialized"
  patientCondition: string
  specialRequests: string
  acceptTerms: boolean
  selectedPaymentMethod: "insurance" | "cash" | "online"
}

export function BookingForm({ onConfirm, onCancel }: BookingFormProps) {
  const [step, setStep] = useState<"type" | "details" | "payment" | "confirm">("type")
  const [formData, setFormData] = useState<BookingData>({
    ambulanceType: "als",
    patientCondition: "",
    specialRequests: "",
    acceptTerms: false,
    selectedPaymentMethod: "insurance",
  })

  const ambulanceTypes = [
    {
      id: "basic" as const,
      name: "Basic Life Support (BLS)",
      description: "For stable patients, minor injuries",
      price: "$150",
      icon: "🚑",
    },
    {
      id: "als" as const,
      name: "Advanced Life Support (ALS)",
      description: "For critical patients, advanced care",
      price: "$250",
      icon: "🚑",
    },
    {
      id: "specialized" as const,
      name: "Specialized Transport",
      description: "NICU, bariatric, or special equipment",
      price: "$400",
      icon: "🚑",
    },
  ]

  const conditions = [
    "Chest Pain",
    "Difficulty Breathing",
    "Unconscious",
    "Severe Bleeding",
    "Trauma/Accident",
    "Other",
  ]

  const paymentMethods = [
    { id: "insurance" as const, name: "Insurance", icon: "🏥" },
    { id: "cash" as const, name: "Cash Payment", icon: "💵" },
    { id: "online" as const, name: "Credit/Debit Card", icon: "💳" },
  ]

  const handleNext = () => {
    if (step === "type") setStep("details")
    else if (step === "details") setStep("payment")
    else if (step === "payment") setStep("confirm")
  }

  const handleBack = () => {
    if (step === "confirm") setStep("payment")
    else if (step === "payment") setStep("details")
    else if (step === "details") setStep("type")
  }

  const handleConfirm = () => {
    onConfirm(formData)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={canCancel ? onCancel : handleBack}
              className="text-primary hover:opacity-80 transition"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-bold text-lg text-foreground">Book Ambulance</h1>
            <div className="w-6"></div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {["type", "details", "payment", "confirm"].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition ${
                  ["type", "details", "payment", "confirm"].indexOf(step) >=
                  ["type", "details", "payment", "confirm"].indexOf(s as string)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          {/* Step 1: Ambulance Type Selection */}
          {step === "type" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Select Ambulance Type</h2>
                <p className="text-sm text-muted-foreground">Choose the appropriate level of care</p>
              </div>

              <div className="space-y-3">
                {ambulanceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, ambulanceType: type.id })}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      formData.ambulanceType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-2xl">{type.icon}</div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{type.name}</p>
                        <p className="text-sm font-bold text-primary">{type.price}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Patient Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Patient Condition</h2>
                <p className="text-sm text-muted-foreground">Help us prepare appropriate care</p>
              </div>

              {/* Condition Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Primary Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  {conditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setFormData({ ...formData, patientCondition: condition })}
                      className={`p-3 rounded-lg border transition text-sm font-medium ${
                        formData.patientCondition === condition
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Special Requests (Optional)</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Any special needs, disabilities, or additional information?"
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {step === "payment" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Payment Method</h2>
                <p className="text-sm text-muted-foreground">Choose how you'll pay for this service</p>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setFormData({ ...formData, selectedPaymentMethod: method.id })}
                    className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center gap-3 ${
                      formData.selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl">{method.icon}</div>
                    <p className="font-semibold text-foreground">{method.name}</p>
                  </button>
                ))}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded"
                />
                <label className="text-sm text-foreground cursor-pointer">
                  I agree to the terms and conditions and understand the charges will be billed to my selected payment
                  method
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirm" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-1">Review Your Booking</h2>
                <p className="text-muted-foreground">Please confirm all details are correct</p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-3">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Ambulance Type</p>
                  <p className="font-semibold text-foreground">
                    {ambulanceTypes.find((t) => t.id === formData.ambulanceType)?.name}
                  </p>
                </div>

                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Patient Condition</p>
                  <p className="font-semibold text-foreground">{formData.patientCondition}</p>
                </div>

                {formData.specialRequests && (
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="font-semibold text-foreground text-sm">{formData.specialRequests}</p>
                  </div>
                )}

                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-semibold text-foreground">
                    {paymentMethods.find((m) => m.id === formData.selectedPaymentMethod)?.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-md mx-auto flex gap-3">
          {step !== "type" && (
            <button
              onClick={handleBack}
              className="flex-1 py-3 px-4 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
            >
              Back
            </button>
          )}

          {step === "confirm" ? (
            <>
              <button
                onClick={onCancel}
                className="flex-1 py-3 px-4 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!formData.acceptTerms}
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Booking
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const canCancel = true
