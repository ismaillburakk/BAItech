"use client"

export function BackgroundElements() {
  return (
    <>
      {/* Tech Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a]"></div>
        <div className="absolute inset-0 tech-grid opacity-20"></div>
      </div>

      {/* Animated Background Particles - Keeping blue as neural network background */}
      <div className="particles">
        <div className="particle" style={{ left: "10%", animationDelay: "0s" }}></div>
        <div className="particle" style={{ left: "20%", animationDelay: "1s" }}></div>
        <div className="particle" style={{ left: "30%", animationDelay: "2s" }}></div>
        <div className="particle" style={{ left: "40%", animationDelay: "3s" }}></div>
        <div className="particle" style={{ left: "50%", animationDelay: "4s" }}></div>
        <div className="particle" style={{ left: "60%", animationDelay: "5s" }}></div>
        <div className="particle" style={{ left: "70%", animationDelay: "0.5s" }}></div>
        <div className="particle" style={{ left: "80%", animationDelay: "1.5s" }}></div>
        <div className="particle" style={{ left: "90%", animationDelay: "2.5s" }}></div>
      </div>
    </>
  )
}
