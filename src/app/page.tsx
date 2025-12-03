'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { waitlistAPI, utils, type SchoolStats } from '@/lib/supabase'

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [topSchools, setTopSchools] = useState<SchoolStats[]>([])

  // Load top schools on component mount
  useEffect(() => {
    loadTopSchools()
  }, [])

  const loadTopSchools = async () => {
    try {
      const schools = await waitlistAPI.getTop3Schools()
      setTopSchools(schools)
    } catch (error) {
      console.error('Error loading top schools:', error)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')
    setMessageType('')

    try {
      // Validate .edu email
      if (!utils.isEduEmail(formData.email)) {
        throw new Error('Please use a valid .edu email address')
      }

      // Check if email is already on waitlist
      const isAlreadySignedUp = await waitlistAPI.isEmailOnWaitlist(formData.email)
      if (isAlreadySignedUp) {
        throw new Error('This email is already on the waitlist!')
      }

      // Add to waitlist
      const result = await waitlistAPI.addToWaitlist({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
      })

      // Get school info
      const schoolDomain = utils.extractSchoolDomain(formData.email)
      const schoolRank = await waitlistAPI.getSchoolRank(schoolDomain)
      const schoolCount = await waitlistAPI.getSchoolSignupCount(schoolDomain)

      setMessage(
        `Welcome to the waitlist! ` +
        `Your school is currently ranked #${schoolRank || 'unranked'}.`
      )
      setMessageType('success')
      
      // Clear form
      setFormData({ firstName: '', lastName: '', email: '' })
      
      // Refresh top schools
      await loadTopSchools()

    } catch (error: any) {
      setMessage(error.message || 'Something went wrong. Please try again.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative">
      {/* Floating Cards - Hidden on mobile and tablet */}
      <div className="absolute inset-0 pointer-events-none hidden xl:block">
        {/* Top Left Card - Campus Events */}
        <FloatingCard 
          className="absolute top-20 left-8 w-56 h-32 bg-gradient-to-br from-slate-900 via-gray-800 to-black rounded-3xl shadow-2xl border border-gray-200 transform -rotate-6 hover:rotate-3 transition-transform duration-500"
          delay={0}
        >
          <div className="h-full w-full rounded-3xl backdrop-blur-sm flex items-center justify-center p-5 perspective-1000 overflow-hidden">
            <div className="text-white text-left w-full">
              <h3 className="text-lg font-black mb-1 text-white">Campus growth</h3>
              <p className="text-sm opacity-90 font-medium">starts here</p>
            </div>
          </div>
        </FloatingCard>

        {/* Top Right Card - Security */}
        <FloatingCard 
          className="absolute top-24 right-8 w-60 h-36 bg-white rounded-2xl shadow-xl border border-gray-100 transform rotate-12 hover:rotate-6 transition-transform duration-500"
          delay={2000}
        >
          <div className="h-full w-full p-5 flex flex-col justify-between overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.8C8,12.2 8.6,11.6 9.2,11.6V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.6V9.5C13.6,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <div className="flex-1 min-h-0">
              <h3 className="font-bold text-gray-900 mb-1 text-sm">Campus Security</h3>
              <p className="text-xs text-gray-600 leading-tight line-clamp-2">Real-time safety updates and emergency alerts</p>
            </div>
          </div>
        </FloatingCard>

        {/* Bottom Left Card - Daily Agenda */}
        <FloatingCard 
          className="absolute bottom-20 left-8 w-48 h-32 bg-gradient-to-br from-emerald-500 to-green-400 rounded-2xl shadow-xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500"
          delay={4000}
        >
          <div className="h-full w-full rounded-2xl backdrop-blur-sm flex flex-col justify-center items-center text-white p-4 overflow-hidden">
            <div className="w-10 h-10 bg-white/20 rounded-xl mb-2 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
              </svg>
            </div>
            <p className="text-center font-bold text-sm">Your daily</p>
            <p className="text-center font-medium text-xs opacity-90">campus agenda</p>
          </div>
        </FloatingCard>

        {/* Bottom Right Card - Connected Events */}
        <FloatingCard 
          className="absolute bottom-24 right-8 w-56 h-32 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl transform rotate-6 hover:rotate-3 transition-transform duration-500"
          delay={1000}
        >
          <div className="h-full w-full p-4 text-white flex flex-col justify-between overflow-hidden">
            <div className="flex space-x-1.5 flex-shrink-0">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-pink-400 rounded-full"></div>
            </div>
            <div className="flex-1 min-h-0">
              <h3 className="font-bold mb-1 text-sm">Connected Events</h3>
              <p className="text-xs opacity-90 leading-tight">Discover and organize campus opportunities</p>
            </div>
          </div>
        </FloatingCard>

        {/* Additional Floating Elements - Repositioned and Smaller */}
        <FloatingCard 
          className="absolute top-1/2 left-16 w-12 h-12 bg-gradient-to-br from-innr-red to-rose-400 rounded-full shadow-lg"
          delay={3000}
        >
          <div></div>
        </FloatingCard>
        
        <FloatingCard 
          className="absolute top-1/3 right-20 w-14 h-14 bg-gradient-to-br from-slate-700 to-gray-800 rounded-2xl shadow-lg"
          delay={5000}
        >
          <div></div>
        </FloatingCard>

        <FloatingCard 
          className="absolute bottom-1/3 left-20 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-lg"
          delay={1500}
        >
          <div></div>
        </FloatingCard>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 py-8 lg:py-12 text-center max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-6 lg:mb-8">
          <div className="mb-3 lg:mb-4">
            <img 
              src="/assets/innr-logo.svg" 
              alt="Innr Logo" 
              className="mx-auto h-14 md:h-16 lg:h-20 w-auto"
            />
          </div>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 mb-4 lg:mb-6 max-w-4xl leading-[1.1]">
          Defragmenting 
          <span className="block text-innr-red">campus communication</span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-600 mb-4 lg:mb-6 max-w-3xl mx-auto leading-relaxed px-4 font-medium">
          Making campus life visible, connected, and accessible for every student, organization, and faculty member.
        </p>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 lg:mb-8">
          <span className="px-4 md:px-6 py-2 md:py-3 bg-slate-900 text-white rounded-full font-semibold text-xs md:text-sm border border-slate-200 shadow-lg">
            📅 Events & Organizations
          </span>
          <span className="px-4 md:px-6 py-2 md:py-3 bg-white text-slate-900 rounded-full font-semibold text-xs md:text-sm border border-slate-200 shadow-lg">
            🔔 Real-time Updates
          </span>
          <span className="px-4 md:px-6 py-2 md:py-3 bg-innr-red text-white rounded-full font-semibold text-xs md:text-sm border border-slate-200 shadow-lg">
            🤝 Campus Network
          </span>
        </div>

        {/* Split Layout: Form + Leaderboard */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          
          {/* Left Side: Waitlist Form */}
          <div className="order-2 lg:order-1">
            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 lg:mb-6">Join the Waitlist</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  required
                  className="px-4 lg:px-6 py-3 lg:py-4 rounded-2xl border-2 border-slate-200 focus:border-innr-red focus:outline-none text-base lg:text-lg bg-white text-slate-900 placeholder-slate-400 shadow-sm"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  required
                  className="px-4 lg:px-6 py-3 lg:py-4 rounded-2xl border-2 border-slate-200 focus:border-innr-red focus:outline-none text-base lg:text-lg bg-white text-slate-900 placeholder-slate-400 shadow-sm"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your .edu email address"
                required
                className="w-full px-4 lg:px-6 py-3 lg:py-4 rounded-2xl border-2 border-slate-200 focus:border-innr-red focus:outline-none text-base lg:text-lg bg-white text-slate-900 placeholder-slate-400 shadow-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold text-base lg:text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-innr-red hover:scale-105'
                } text-white`}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist!'}
              </button>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-2xl mb-4 ${
                messageType === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
              </svg>
              <span>Coming to iOS and Web • We respect your privacy</span>
            </div>
          </div>

          {/* Right Side: School Competition Leaderboard */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-slate-200 p-4 lg:p-6 shadow-lg">
              <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2 text-center">
                🏆 School Competition
              </h3>
              <p className="text-slate-600 text-xs lg:text-sm text-center mb-4 lg:mb-6">
                We'll launch first at the top schools. Get your friends to join!
              </p>
              
              {topSchools.length > 0 ? (
                <div className="space-y-2 lg:space-y-3">
                  {topSchools.map((school, index) => (
                    <div
                      key={school.school_domain}
                      className={`flex items-center justify-between p-3 lg:p-4 rounded-2xl border ${
                        index === 0
                          ? 'bg-yellow-50 border-yellow-200'
                          : index === 1
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <span className="text-xl lg:text-2xl">{school.medal}</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm lg:text-base truncate">
                            {utils.formatSchoolName(school.school_name)}
                          </h4>
                          <p className="text-xs text-slate-600 truncate">
                            Recent: {school.sample_students?.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-base lg:text-lg font-black text-innr-red">#{index + 1}</span>
                        {index === 0 && (
                          <div className="text-xs text-innr-red font-bold">LEADING!</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-slate-600">Be the first school to join!</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
          }
          33% { 
            transform: translateY(-20px) rotateX(2deg) rotateY(1deg);
          }
          66% { 
            transform: translateY(-10px) rotateX(-1deg) rotateY(-2deg);
          }
        }
        
        @keyframes float-3d {
          0%, 100% { 
            transform: translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg);
          }
          50% { 
            transform: translateY(-15px) translateZ(10px) rotateX(3deg) rotateY(2deg);
          }
        }
        
        .floating-card {
          animation: float-3d infinite ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        body {
          perspective: 1200px;
        }
      `}</style>
    </main>
  )
}