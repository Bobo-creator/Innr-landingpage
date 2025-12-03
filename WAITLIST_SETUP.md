# 🚀 Innr Waitlist System Setup Guide

This guide will help you set up the complete waitlist system with school competition tracking.

## 📋 Prerequisites

1. **Supabase Project**: Make sure you have a Supabase project running
2. **Existing Schema**: You should have your main Innr schema already deployed
3. **Environment Variables**: Access to your Supabase keys

## 🛠 Step-by-Step Setup

### Step 1: Deploy the Waitlist Schema

1. **Open Supabase SQL Editor** in your project dashboard
2. **Copy and paste** the contents of `waitlist-schema.sql` 
3. **Execute the SQL** - this will create:
   - `waitlist_signups` table
   - Helper functions for school extraction
   - Views for leaderboard and stats
   - RLS policies for security
   - Triggers for auto-population

### Step 2: Configure Environment Variables

1. **Copy the environment template**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your Supabase credentials** in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Get your keys from Supabase Dashboard**:
   - Project Settings → API → URL and anon key

### Step 3: Test the Database Setup

Run these queries in Supabase SQL Editor to verify everything works:

```sql
-- Test 1: Insert a sample signup
INSERT INTO waitlist_signups (first_name, last_name, email)
VALUES ('John', 'Doe', 'john.doe@harvard.edu');

-- Test 2: Check if views work
SELECT * FROM top_3_schools;
SELECT * FROM waitlist_stats;

-- Test 3: Test helper functions
SELECT is_email_on_waitlist('john.doe@harvard.edu');
SELECT get_school_rank('harvard.edu');
```

### Step 4: Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test the waitlist form!

## 🎯 Features Included

### 🏆 School Competition System
- **Top 3 Schools Display**: Shows leading schools with medals
- **Real-time Updates**: Leaderboard updates after each signup
- **School Ranking**: Automatic ranking based on signup count
- **Sample Students**: Shows recent signups (privacy-friendly)

### 📝 Waitlist Form
- **Three Fields**: First name, last name, .edu email
- **Email Validation**: Only .edu emails accepted
- **Duplicate Prevention**: Checks if email already exists
- **School Detection**: Automatically extracts school from email
- **Position Tracking**: Assigns sequential waitlist positions

### 🔐 Security Features
- **RLS Policies**: Row-level security enabled
- **Email Validation**: Server-side .edu validation
- **Privacy Protection**: No personal data in public views
- **SQL Injection Protection**: Parameterized queries

## 🎨 Frontend Features

### 📊 Competition Display
- **Visual Medals**: 🥇🥈🥉 for top 3 schools
- **Signup Counts**: Real-time count display
- **Recent Activity**: Shows latest students (anonymized)
- **Responsive Design**: Works on all devices

### 📋 Form Experience
- **Progressive Enhancement**: Works without JavaScript
- **Loading States**: Shows "Joining..." during submission
- **Error Handling**: Clear error messages
- **Success Feedback**: Shows position and school rank

## 🔧 Database Schema Details

### Main Table: `waitlist_signups`
```sql
- id (UUID, auto-generated)
- first_name (VARCHAR, required)
- last_name (VARCHAR, required)
- email (VARCHAR, unique, .edu validated)
- university_id (UUID, FK to universities)
- school_domain (VARCHAR, auto-extracted)
- school_name (VARCHAR, auto-generated)
- position (INTEGER, auto-assigned)
- is_verified (BOOLEAN, default false)
- verification_token (UUID, for future email verification)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### Key Views
- **`top_3_schools`**: Real-time top 3 for competition
- **`school_leaderboard`**: Full ranking of all schools  
- **`waitlist_stats`**: Overall statistics

### Helper Functions
- **`is_email_on_waitlist(email)`**: Check duplicates
- **`get_school_rank(domain)`**: Get school's rank
- **`get_school_signup_count(domain)`**: Get school's total signups

## 🚀 Advanced Customization

### Adding Email Verification
```sql
-- Add email verification workflow
UPDATE waitlist_signups 
SET is_verified = true 
WHERE verification_token = 'user-token';
```

### Custom School Name Mappings
```sql
-- Add custom mappings in the extract_school_name_waitlist function
WHEN base_domain = 'mit' THEN 'Massachusetts Institute of Technology'
WHEN base_domain = 'stanford' THEN 'Stanford University'
```

### Analytics Tracking
```sql
-- Track signup sources
ALTER TABLE waitlist_signups ADD COLUMN source VARCHAR(50);
ALTER TABLE waitlist_signups ADD COLUMN referrer_email VARCHAR(255);
```

## 🐛 Troubleshooting

### Common Issues

1. **"Supabase client error"**
   - Check `.env.local` has correct values
   - Verify Supabase project URL and key

2. **"RLS policy error"**
   - Ensure all SQL from `waitlist-schema.sql` was executed
   - Check if anon user has SELECT permissions on views

3. **"Email validation failed"**
   - Verify the email ends with `.edu`
   - Check for typos in domain

4. **"School not detected"**
   - The system auto-generates school names
   - For custom schools, add them to the `universities` table

### Database Debug Queries

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist_signups';

-- Check recent signups
SELECT * FROM waitlist_signups ORDER BY created_at DESC LIMIT 10;

-- View all schools
SELECT * FROM school_leaderboard;

-- Check function permissions
SELECT has_function_privilege('anon', 'is_email_on_waitlist(text)', 'execute');
```

## 📈 Next Steps

1. **Email Verification**: Add verification emails using Supabase Auth
2. **Admin Dashboard**: Build admin interface for managing signups
3. **Analytics**: Track signup sources and referrals
4. **Social Sharing**: Add sharing buttons for school competition
5. **Push Notifications**: Notify users about school ranking changes

## 🤝 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all SQL was executed successfully
3. Test with the debug queries provided
4. Check browser console for JavaScript errors

The system is designed to be robust and should handle edge cases gracefully!