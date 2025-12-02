'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const FloatingCard = ({ 
  children, 
  className = '', 
  delay = 0,
  duration = 6000 
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) => {
  return (
    <div 
      className={`floating-card ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const [email, setEmail] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with Supabase
    console.log('Email submitted:', email)
    setEmail('')
    alert('Thanks for joining the waitlist! We\'ll be in touch soon.')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Floating Cards */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left Card - Campus Events */}
        <FloatingCard 
          className="absolute top-20 left-4 md:left-20 w-64 md:w-80 h-40 md:h-48 bg-gradient-to-br from-slate-900 via-gray-800 to-black rounded-3xl shadow-2xl border border-gray-200"
          delay={0}
        >
          <div className="h-full w-full rounded-3xl backdrop-blur-sm flex items-center justify-center p-6">
            <div className="text-white text-center">
              <div className="w-12 h-12 bg-innr-red rounded-xl mx-auto mb-3 flex items-center justify-center">
                <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Campus Events</h3>
              <p className="text-sm opacity-80">Never miss what matters</p>
            </div>
          </div>
        </FloatingCard>

        {/* Top Right Card - Real-time Updates */}
        <FloatingCard 
          className="absolute top-32 right-4 md:right-20 w-60 md:w-72 h-36 md:h-44 bg-white rounded-2xl shadow-xl border border-gray-100"
          delay={2000}
        >
          <div className="h-full w-full p-6 flex flex-col justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 13.5l3.5 2.5-3.5 2.5L8.5 16l3.5-2.5z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Real-time Updates</h3>
              <p className="text-sm text-gray-600">Stay connected with live campus notifications and announcements</p>
            </div>
          </div>
        </FloatingCard>

        {/* Bottom Left Card - Organizations */}
        <FloatingCard 
          className="absolute bottom-32 left-4 md:left-16 w-56 md:w-64 h-36 md:h-40 bg-gradient-to-br from-innr-red to-rose-500 rounded-2xl shadow-xl"
          delay={4000}
        >
          <div className="h-full w-full rounded-2xl backdrop-blur-sm flex flex-col justify-center items-center text-white p-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h3v7c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-7h3v6h13v-6c0-1.1-.9-2-2-2h-1l-3.5-6.5c-.33-.67-1-.67-1.34 0L17.5 10H16v8z"/>
              </svg>
            </div>
            <p className="text-center font-semibold text-sm">Student Organizations</p>
            <p className="text-center text-xs opacity-90 mt-1">Connect & collaborate</p>
          </div>
        </FloatingCard>

        {/* Bottom Right Card - Faculty Connect */}
        <FloatingCard 
          className="absolute bottom-20 right-4 md:right-16 w-60 md:w-72 h-36 md:h-44 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700"
          delay={1000}
        >
          <div className="h-full w-full p-6 text-white flex flex-col justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-1">Faculty & Alumni</h3>
              <p className="text-sm opacity-80">Bridge connections across your campus community</p>
            </div>
          </div>
        </FloatingCard>

        {/* Additional Floating Elements */}
        <FloatingCard 
          className="absolute top-1/2 left-8 w-16 h-16 bg-gradient-to-br from-innr-red to-rose-400 rounded-full shadow-lg"
          delay={3000}
        >
          <div></div>
        </FloatingCard>
        
        <FloatingCard 
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-slate-700 to-gray-800 rounded-2xl shadow-lg"
          delay={5000}
        >
          <div></div>
        </FloatingCard>

        <FloatingCard 
          className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg"
          delay={1500}
        >
          <div></div>
        </FloatingCard>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="mb-4">
            <svg width="160" height="60" viewBox="0 0 200 80" className="mx-auto">
              <text x="0" y="55" fontFamily="Inter, system-ui, sans-serif" fontSize="42" fontWeight="900" fill="#000000">
                Innr
              </text>
              <circle cx="150" cy="35" r="6" fill="#FF4136"/>
            </svg>
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 max-w-5xl leading-[1.1]">
          Defragmenting 
          <span className="block text-innr-red">campus communication</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4 font-medium">
          Making campus life visible, connected, and accessible for every student, organization, and faculty member.
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <span className="px-6 py-3 bg-slate-900 text-white rounded-full font-semibold text-sm border border-slate-200 shadow-lg">
            📅 Events & Organizations
          </span>
          <span className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold text-sm border border-slate-200 shadow-lg">
            🔔 Real-time Updates
          </span>
          <span className="px-6 py-3 bg-innr-red text-white rounded-full font-semibold text-sm border border-slate-200 shadow-lg">
            🤝 Campus Network
          </span>
        </div>

        {/* Join Waitlist */}
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-innr-red focus:outline-none text-lg bg-white/80 backdrop-blur-sm placeholder-slate-400"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-slate-900 hover:bg-innr-red text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join Waitlist
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
            </svg>
            <span className="text-sm">Coming to iOS and Web • We respect your privacy</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        .floating-card {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </main>
  )
}