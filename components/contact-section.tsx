"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert("Mesajınız başarıyla gönderildi!")
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        alert("Mesaj gönderilemedi: " + result.message)
      }
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-4 neon-text">İletişime Geçin</h2>
          <p className="text-xl text-gray-300">
            AI çözümlerimiz hakkında daha fazla bilgi almak için bizimle iletişime geçin
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-6">Bize Ulaşın</h3>
            <div className="space-y-6">
              {/* E-posta */}
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-tech-blue to-neon-blue rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">E-posta</p>
                  <p className="text-gray-300">info@baitech.com.tr</p>
                </div>
              </div>

              {/* Telefon */}
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-logo-orange to-logo-gold rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Telefon</p>
                  <p className="text-gray-300">+90 532 369 4564</p>
                </div>
              </div>

              {/* Adres */}
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-r from-tech-cyan to-neon-blue rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Adres</p>
                  <p className="text-gray-300">
                    Tekstil OSB Mahallesi 204. Cadde
                    <br />
                    No:566/103 Merkez Uşak
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="tech-border rounded-2xl p-8 cyber-glow animate-fade-in-up relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-logo-orange/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız ve soyadınız"
                  required
                  className="w-full px-4 py-3 bg-tech-dark/80 border border-tech-blue/30 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta adresiniz"
                  required
                  className="w-full px-4 py-3 bg-tech-dark/80 border border-tech-blue/30 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all text-white placeholder-gray-400 backdrop-blur-sm"
                />
              </div>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Mesaj konusu"
                required
                className="w-full px-4 py-3 bg-tech-dark/80 border border-tech-blue/30 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all text-white placeholder-gray-400 backdrop-blur-sm"
              />

              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Mesajınızı yazın..."
                required
                className="w-full px-4 py-3 bg-tech-dark/80 border border-tech-blue/30 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue transition-all text-white placeholder-gray-400 resize-none backdrop-blur-sm"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-logo-orange to-logo-gold hover:from-logo-gold hover:to-logo-orange text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 cyber-glow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="inline h-5 w-5 mr-2 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="inline h-5 w-5 mr-2" />
                    Mesaj Gönder
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
