-- ============================================================================
-- INNR WAITLIST EXTENSION
-- Add this to your existing schema for waitlist functionality
-- ============================================================================

-- ============================================================================
-- SECTION 1: WAITLIST TABLE
-- ============================================================================

CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  university_id UUID REFERENCES public.universities(id),
  school_domain VARCHAR(255) NOT NULL,
  school_name VARCHAR(255),
  position INTEGER, -- Position in the waitlist (auto-assigned)
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token UUID DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_edu_email CHECK (email ILIKE '%.edu'),
  CONSTRAINT valid_names CHECK (
    LENGTH(TRIM(first_name)) >= 1 AND 
    LENGTH(TRIM(last_name)) >= 1
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_waitlist_signups_updated_at
  BEFORE UPDATE ON public.waitlist_signups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 2: HELPER FUNCTIONS FOR WAITLIST
-- ============================================================================

-- Function to extract school domain from email
CREATE OR REPLACE FUNCTION extract_school_domain_waitlist(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(SPLIT_PART(email_address, '@', 2));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract school name from domain (improved)
CREATE OR REPLACE FUNCTION extract_school_name_waitlist(domain TEXT)
RETURNS TEXT AS $$
DECLARE
  base_domain TEXT;
  school_parts TEXT[];
  formatted_name TEXT;
BEGIN
  -- Remove .edu and get the main part
  base_domain := SPLIT_PART(domain, '.', 1);
  
  -- Handle common patterns
  CASE 
    WHEN base_domain LIKE '%university%' OR base_domain LIKE '%college%' THEN
      -- Already has university/college in name
      formatted_name := INITCAP(REPLACE(REPLACE(base_domain, '-', ' '), '_', ' '));
    WHEN LENGTH(base_domain) <= 4 THEN
      -- Short abbreviations like 'mit', 'nyu', 'usc'
      formatted_name := UPPER(base_domain);
    ELSE
      -- Add "University" to longer names
      formatted_name := INITCAP(REPLACE(REPLACE(base_domain, '-', ' '), '_', ' ')) || ' University';
  END CASE;
  
  RETURN formatted_name;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get next waitlist position
CREATE OR REPLACE FUNCTION get_next_waitlist_position()
RETURNS INTEGER AS $$
DECLARE
  next_pos INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) + 1
  INTO next_pos
  FROM public.waitlist_signups;
  
  RETURN next_pos;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 3: TRIGGERS FOR AUTO-POPULATION
-- ============================================================================

-- Trigger function to auto-populate school info and position
CREATE OR REPLACE FUNCTION populate_waitlist_info()
RETURNS TRIGGER AS $$
DECLARE
  extracted_domain TEXT;
  matched_university_id UUID;
BEGIN
  -- Extract domain
  extracted_domain := extract_school_domain_waitlist(NEW.email);
  NEW.school_domain := extracted_domain;
  
  -- Try to find matching university in existing universities table
  SELECT id INTO matched_university_id
  FROM public.universities
  WHERE domain = extracted_domain
  LIMIT 1;
  
  NEW.university_id := matched_university_id;
  
  -- Generate school name if university not found in system
  IF matched_university_id IS NULL THEN
    NEW.school_name := extract_school_name_waitlist(extracted_domain);
  ELSE
    SELECT name INTO NEW.school_name
    FROM public.universities
    WHERE id = matched_university_id;
  END IF;
  
  -- Set position if not provided
  IF NEW.position IS NULL THEN
    NEW.position := get_next_waitlist_position();
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_populate_waitlist_info
  BEFORE INSERT OR UPDATE ON public.waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION populate_waitlist_info();

-- ============================================================================
-- SECTION 4: VIEWS FOR SCHOOL COMPETITION & LEADERBOARD
-- ============================================================================

-- School leaderboard view (all schools with signups)
CREATE OR REPLACE VIEW school_leaderboard AS
SELECT 
  school_domain,
  school_name,
  university_id,
  COUNT(*) as signup_count,
  RANK() OVER (ORDER BY COUNT(*) DESC, MIN(created_at) ASC) as rank,
  -- Get sample student names for display (first 3, privacy-friendly)
  ARRAY_AGG(
    first_name || ' ' || SUBSTRING(last_name, 1, 1) || '.' 
    ORDER BY created_at 
    LIMIT 3
  ) as sample_students,
  MIN(created_at) as first_signup_at,
  MAX(created_at) as latest_signup_at,
  -- Calculate momentum (signups in last 7 days)
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as recent_signups
FROM waitlist_signups 
WHERE is_verified = TRUE  -- Only count verified signups
GROUP BY school_domain, school_name, university_id
ORDER BY signup_count DESC, first_signup_at ASC;

-- Top 3 schools for frontend display
CREATE OR REPLACE VIEW top_3_schools AS
SELECT 
  *,
  CASE 
    WHEN rank = 1 THEN '🥇'
    WHEN rank = 2 THEN '🥈'
    WHEN rank = 3 THEN '🥉'
    ELSE ''
  END as medal
FROM school_leaderboard 
WHERE rank <= 3;

-- Waitlist stats for admin dashboard
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
  COUNT(*) as total_signups,
  COUNT(*) FILTER (WHERE is_verified = TRUE) as verified_signups,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as signups_last_24h,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as signups_last_week,
  COUNT(DISTINCT school_domain) as unique_schools,
  COUNT(DISTINCT university_id) FILTER (WHERE university_id IS NOT NULL) as known_universities
FROM waitlist_signups;

-- ============================================================================
-- SECTION 5: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_waitlist_email ON public.waitlist_signups(email);
CREATE INDEX idx_waitlist_school_domain ON public.waitlist_signups(school_domain);
CREATE INDEX idx_waitlist_university_id ON public.waitlist_signups(university_id);
CREATE INDEX idx_waitlist_created_at ON public.waitlist_signups(created_at DESC);
CREATE INDEX idx_waitlist_position ON public.waitlist_signups(position);
CREATE INDEX idx_waitlist_verified ON public.waitlist_signups(is_verified) WHERE is_verified = TRUE;

-- ============================================================================
-- SECTION 6: ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous signups (public can insert)
CREATE POLICY "Allow public waitlist signup" 
ON public.waitlist_signups FOR INSERT 
WITH CHECK (true);

-- Policy: Users can view their own signup
CREATE POLICY "Users can view own waitlist entry"
ON public.waitlist_signups FOR SELECT
USING (email = (auth.jwt() ->> 'email') OR auth.role() = 'service_role');

-- Policy: Allow public to read aggregated school stats via views
-- (The views will handle the aggregation, no direct table access to personal data)

-- Grant permissions to views for public access
GRANT SELECT ON school_leaderboard TO anon, authenticated;
GRANT SELECT ON top_3_schools TO anon, authenticated;
GRANT SELECT ON waitlist_stats TO anon, authenticated;

-- Admin access to full table
CREATE POLICY "Admins can view all waitlist entries"
ON public.waitlist_signups FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('founder', 'admin')
  )
);

-- ============================================================================
-- SECTION 7: FUNCTIONS FOR FRONTEND USE
-- ============================================================================

-- Function to check if email is already signed up
CREATE OR REPLACE FUNCTION is_email_on_waitlist(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.waitlist_signups 
    WHERE LOWER(email) = LOWER(check_email)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get school rank by email domain
CREATE OR REPLACE FUNCTION get_school_rank(email_domain TEXT)
RETURNS INTEGER AS $$
DECLARE
  school_rank INTEGER;
BEGIN
  SELECT rank INTO school_rank
  FROM school_leaderboard 
  WHERE school_domain = LOWER(email_domain);
  
  RETURN COALESCE(school_rank, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total signups for a school
CREATE OR REPLACE FUNCTION get_school_signup_count(email_domain TEXT)
RETURNS INTEGER AS $$
DECLARE
  signup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO signup_count
  FROM public.waitlist_signups 
  WHERE school_domain = LOWER(email_domain)
  AND is_verified = TRUE;
  
  RETURN COALESCE(signup_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 8: EXAMPLE QUERIES FOR FRONTEND
-- ============================================================================

/*

-- Get top 3 schools for competition display:
SELECT * FROM top_3_schools;

-- Get overall stats:
SELECT * FROM waitlist_stats;

-- Check if email already signed up:
SELECT is_email_on_waitlist('student@harvard.edu');

-- Get rank for a specific school:
SELECT get_school_rank('harvard.edu');

-- Get signup count for a school:
SELECT get_school_signup_count('harvard.edu');

-- Get full leaderboard (first 10):
SELECT * FROM school_leaderboard LIMIT 10;

-- Insert a new signup (what your form will do):
INSERT INTO waitlist_signups (first_name, last_name, email)
VALUES ('John', 'Doe', 'john.doe@harvard.edu');

*/

-- ============================================================================
-- SECTION 9: SAMPLE DATA FOR TESTING (REMOVE IN PRODUCTION)
-- ============================================================================

/*
-- Sample signups for testing
INSERT INTO waitlist_signups (first_name, last_name, email, is_verified) VALUES
  ('John', 'Doe', 'john.doe@harvard.edu', true),
  ('Jane', 'Smith', 'jane.smith@mit.edu', true),
  ('Mike', 'Johnson', 'mike.j@stanford.edu', true),
  ('Sarah', 'Wilson', 'sarah.w@berkeley.edu', true),
  ('Alex', 'Brown', 'alex.brown@harvard.edu', true),
  ('Emily', 'Davis', 'emily.d@mit.edu', true),
  ('Chris', 'Lee', 'chris.lee@yale.edu', true),
  ('Maria', 'Garcia', 'maria.g@ucla.edu', true),
  ('David', 'Kim', 'david.k@stanford.edu', true),
  ('Lisa', 'Wang', 'lisa.w@harvard.edu', true);
*/