import { createClient } from '@supabase/supabase-js';

// Fallback to the authentic credentials provided directly by the developer
const DEFAULT_SUPABASE_URL = 'https://yylepyhpzctlzojholzf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bGVweWhwemN0bHpvamhvbHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODM1MTgsImV4cCI6MjA5NzM1OTUxOH0.jgK9NKZFJPD58zSZfVOY2k41kvojsmhS5EAzAjCCex0';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Tracks and estimates metrics like bounce rate, session duration, and active tab transitions.
 */
export const getSessionMetrics = () => {
  const startTime = localStorage.getItem('mollywood_session_start_time');
  const now = Date.now();
  const durationSeconds = startTime ? Math.round((now - parseInt(startTime, 10)) / 1000) : 0;
  
  // Track bounce-like indicators
  const clicks = parseInt(localStorage.getItem('mollywood_interaction_clicks') || '0', 10);
  const viewsVisited = JSON.parse(localStorage.getItem('mollywood_visited_views') || '[]');
  
  return {
    durationSeconds,
    pageClicks: clicks,
    viewsHistory: viewsVisited.join(' -> '),
    bounceRateIndicator: clicks < 3 ? 'High Bounce Risk' : 'Low Bounce engaged',
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || 'Direct Visit'
  };
};

/**
 * SQL for the user to execute inside their Supabase Queries page to set up the 3 tables perfectly:
 */
export const SUPABASE_SETUP_SQL = `-- 1. MOLLEYWOOD CUSTOMER USERS TABLE
CREATE TABLE IF NOT EXISTS mollywood_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  bounce_info jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. MOLLEYWOOD DISH ORDERS TABLE
CREATE TABLE IF NOT EXISTS mollywood_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text NOT NULL,
  items jsonb NOT NULL,
  total_price numeric NOT NULL,
  stay_duration_seconds integer,
  page_clicks_during_session integer,
  views_history text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- 3. MOLLEYWOOD TABLE BOOKINGS TABLE 
CREATE TABLE IF NOT EXISTS mollywood_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text,
  user_name text NOT NULL,
  phone text NOT NULL,
  booking_date text NOT NULL,
  booking_time text NOT NULL,
  guests integer NOT NULL,
  special_requests text,
  status text DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS & setup policies for anonymous access
ALTER TABLE mollywood_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mollywood_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE mollywood_bookings ENABLE ROW LEVEL SECURITY;

-- Simple policies allowing insert and select from the app
CREATE POLICY "Allow public select" ON mollywood_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mollywood_users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select orders" ON mollywood_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert orders" ON mollywood_orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select bookings" ON mollywood_bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON mollywood_bookings FOR INSERT WITH CHECK (true);
`;
