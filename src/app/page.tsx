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

        {/* Bottom Left Card */}
        <FloatingCard 
          className="absolute bottom-32 left-4 md:left-16 w-56 md:w-64 h-36 md:h-40 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-xl"
          delay={4000}
        >
          <div className="h-full w-full rounded-2xl bg-black/10 backdrop-blur-sm flex flex-col justify-center items-center text-white p-4">
            <div className="w-8 h-8 bg-white/30 rounded-lg mb-3"></div>
            <p className="text-center font-medium">Your daily campus agenda</p>
          </div>
        </FloatingCard>

        {/* Bottom Right Cards */}
        <FloatingCard 
          className="absolute bottom-20 right-4 md:right-16 w-60 md:w-72 h-36 md:h-44 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl"
          delay={1000}
        >
          <div className="h-full w-full p-6 text-white flex flex-col justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold mb-2">Connected Events</h3>
              <p className="text-sm opacity-80">Discover, organize, and never miss campus opportunities</p>
            </div>
          </div>
        </FloatingCard>

        {/* Additional Floating Elements */}
        <FloatingCard 
          className="absolute top-1/2 left-8 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-lg"
          delay={3000}
        >
          <div></div>
        </FloatingCard>
        
        <FloatingCard 
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg"
          delay={5000}
        >
          <div></div>
        </FloatingCard>

        <FloatingCard 
          className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full shadow-lg"
          delay={1500}
        >
          <div></div>
        </FloatingCard>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-black text-gray-900 mb-2">innr</h1>
          <div className="w-12 h-1 bg-innr-red mx-auto"></div>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 max-w-4xl leading-tight">
          The future of 
          <span className="block text-innr-red">campus communication</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed px-4">
          Defragmenting campus life. Making student experiences visible, connected, and accessible.
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <span className="px-4 py-2 bg-innr-red text-white rounded-full font-medium">
            Events & Organizations
          </span>
          <span className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium">
            Real-time Updates
          </span>
          <span className="px-4 py-2 bg-green-500 text-white rounded-full font-medium">
            Campus Network
          </span>
        </div>

        {/* Join Waitlist */}
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200 focus:border-innr-red focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Join Waitlist
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            ✉️ Coming to iOS and Web • No spam, just updates
          </p>
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