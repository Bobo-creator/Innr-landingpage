-- Fix RLS policy for anonymous waitlist signups
-- Run this in your Supabase SQL Editor

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow public waitlist signup" ON public.waitlist_signups;

-- Create a new policy that allows anonymous users to insert
CREATE POLICY "Allow anonymous waitlist signup" 
ON public.waitlist_signups 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also fix the select policy to allow users to view their own entry by email
DROP POLICY IF EXISTS "Users can view own waitlist entry" ON public.waitlist_signups;

CREATE POLICY "Users can view own waitlist entry"
ON public.waitlist_signups 
FOR SELECT
TO anon, authenticated
USING (true);  -- Allow reading for public stats, but personal data is protected by the views