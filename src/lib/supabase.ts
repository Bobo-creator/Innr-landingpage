import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our waitlist system
export interface WaitlistSignup {
  id?: string
  first_name: string
  last_name: string
  email: string
  school_domain?: string
  school_name?: string
  university_id?: string
  position?: number
  is_verified?: boolean
  created_at?: string
}

export interface SchoolStats {
  school_domain: string
  school_name: string
  signup_count: number
  rank: number
  sample_students: string[]
  medal?: string
}

export interface WaitlistStats {
  total_signups: number
  verified_signups: number
  signups_last_24h: number
  signups_last_week: number
  unique_schools: number
  known_universities: number
}

// API Functions
export const waitlistAPI = {
  // Add someone to waitlist
  async addToWaitlist(signup: Omit<WaitlistSignup, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .insert([signup])
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Check if email is already on waitlist
  async isEmailOnWaitlist(email: string) {
    const { data } = await supabase
      .rpc('is_email_on_waitlist', { check_email: email })
    
    return data || false
  },

  // Get top 3 schools for competition
  async getTop3Schools(): Promise<SchoolStats[]> {
    const { data, error } = await supabase
      .from('top_3_schools')
      .select('*')
      .order('rank', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  // Get school leaderboard (first 10)
  async getSchoolLeaderboard(limit = 10): Promise<SchoolStats[]> {
    const { data, error } = await supabase
      .from('school_leaderboard')
      .select('*')
      .order('signup_count', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },

  // Get overall waitlist stats
  async getWaitlistStats(): Promise<WaitlistStats | null> {
    const { data, error } = await supabase
      .from('waitlist_stats')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Get rank for a specific school
  async getSchoolRank(emailDomain: string) {
    const { data } = await supabase
      .rpc('get_school_rank', { email_domain: emailDomain })
    
    return data || 0
  },

  // Get signup count for a school
  async getSchoolSignupCount(emailDomain: string) {
    const { data } = await supabase
      .rpc('get_school_signup_count', { email_domain: emailDomain })
    
    return data || 0
  }
}

// Utility functions
export const utils = {
  // Extract school domain from email
  extractSchoolDomain(email: string): string {
    return email.split('@')[1]?.toLowerCase() || ''
  },

  // Validate .edu email
  isEduEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.edu$/i.test(email)
  },

  // Format school name for display
  formatSchoolName(schoolName: string): string {
    if (!schoolName) return 'Unknown School'
    
    // Handle common abbreviations
    const abbreviations: { [key: string]: string } = {
      'MIT': 'Massachusetts Institute of Technology',
      'NYU': 'New York University',
      'USC': 'University of Southern California',
      'UCLA': 'University of California, Los Angeles',
      'UC BERKELEY': 'University of California, Berkeley',
    }
    
    const upperName = schoolName.toUpperCase()
    if (abbreviations[upperName]) {
      return abbreviations[upperName]
    }
    
    return schoolName
  }
}