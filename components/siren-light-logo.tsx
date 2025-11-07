"use client"

export function SirenLightLogo() {
  return (
    <div className="relative w-12 h-12 animate-float">
      <svg className="w-full h-full animate-siren-blink" viewBox="0 0 100 100" fill="none">
        {/* LED Light Bulb - Blue */}
        <circle cx="30" cy="30" r="12" fill="url(#blueLED)" className="animate-led-blue" />
        <circle cx="30" cy="30" r="11" fill="none" stroke="#0066ff" strokeWidth="1" opacity="0.5" />

        {/* LED Light Bulb - Red */}
        <circle cx="70" cy="30" r="12" fill="url(#redLED)" className="animate-led-red" />
        <circle cx="70" cy="30" r="11" fill="none" stroke="#ff0000" strokeWidth="1" opacity="0.5" />

        {/* Base connector */}
        <rect x="35" y="50" width="30" height="8" rx="2" fill="#333" />
        <rect x="38" y="62" width="24" height="6" rx="1" fill="#666" />
        <rect x="40" y="72" width="20" height="4" rx="1" fill="#333" />

        {/* Glass cover effect */}
        <ellipse cx="30" cy="30" rx="13" ry="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <ellipse cx="70" cy="30" rx="13" ry="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Gradients for LED glow */}
        <defs>
          <radialGradient id="blueLED" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#66ccff" />
            <stop offset="100%" stopColor="#0066ff" />
          </radialGradient>
          <radialGradient id="redLED" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#ff6666" />
            <stop offset="100%" stopColor="#ff0000" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
