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
          className="absolute top-20 left-4 md:left-20 w-64 md:w-80 h-40 md:h-48 bg-gradient-to-br from-slate-900 via-gray-800 to-black rounded-3xl shadow-2xl border border-gray-200 transform -rotate-6 hover:rotate-3 transition-transform duration-500"
          delay={0}
        >
          <div className="h-full w-full rounded-3xl backdrop-blur-sm flex items-center justify-center p-6 perspective-1000">
            <div className="text-white text-left w-full">
              <h3 className="text-xl font-black mb-2 text-white">Campus growth</h3>
              <p className="text-sm opacity-90 font-medium">starts here</p>
            </div>
          </div>
        </FloatingCard>

        {/* Top Right Card - Security */}
        <FloatingCard 
          className="absolute top-32 right-4 md:right-20 w-60 md:w-72 h-36 md:h-44 bg-white rounded-2xl shadow-xl border border-gray-100 transform rotate-12 hover:rotate-6 transition-transform duration-500"
          delay={2000}
        >
          <div className="h-full w-full p-6 flex flex-col justify-between">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.8C8,12.2 8.6,11.6 9.2,11.6V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.6V9.5C13.6,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Campus Security</h3>
              <p className="text-sm text-gray-600">Real-time safety updates and emergency alerts for peace of mind</p>
            </div>
          </div>
        </FloatingCard>

        {/* Bottom Left Card - Daily Agenda */}
        <FloatingCard 
          className="absolute bottom-32 left-4 md:left-16 w-56 md:w-64 h-36 md:h-40 bg-gradient-to-br from-emerald-500 to-green-400 rounded-2xl shadow-xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500"
          delay={4000}
        >
          <div className="h-full w-full rounded-2xl backdrop-blur-sm flex flex-col justify-center items-center text-white p-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
              </svg>
            </div>
            <p className="text-center font-bold text-lg">Your daily</p>
            <p className="text-center font-medium text-sm opacity-90">campus agenda</p>
          </div>
        </FloatingCard>

        {/* Bottom Right Card - Connected Events */}
        <FloatingCard 
          className="absolute bottom-20 right-4 md:right-16 w-60 md:w-72 h-36 md:h-44 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl transform rotate-6 hover:rotate-3 transition-transform duration-500"
          delay={1000}
        >
          <div className="h-full w-full p-6 text-white flex flex-col justify-between">
            <div className="flex space-x-2 mb-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-lg">Connected Events</h3>
              <p className="text-sm opacity-80">Discover, organize, and never miss campus opportunities</p>
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
            <img 
              src="/assets/innr-logo.svg" 
              alt="Innr Logo" 
              className="mx-auto h-20 md:h-24 lg:h-28 w-auto"
            />
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