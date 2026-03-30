import { createClient } from '@supabase/supabase-js';

// ╔══════════════════════════════════════════════════════════════════╗
// ║  SUPABASE CONFIGURATION                                        ║
// ║  Replace these with your Supabase project credentials.         ║
// ║  Get them from: https://supabase.com → Your Project → Settings ║
// ║  → API → Project URL and anon/public key                       ║
// ╚══════════════════════════════════════════════════════════════════╝

const SUPABASE_URL = 'https://weicusurtgkpgtlapcqg.supabase.co';       // e.g. https://xyzabc.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlaWN1c3VydGdrcGd0bGFwY3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MTY5ODcsImV4cCI6MjA5MDA5Mjk4N30.Zr5uEE04F8VWj1oFat9-MwMCmlAX_Q4e7-Om6XVjZAU';     // e.g. eyJhbGciOiJI...

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,    // We manage session in chrome.storage ourselves
    detectSessionInUrl: false, // Not applicable in extension context
  },
});

/**
 * Check if Supabase is properly configured (not using placeholder values)
 */
export function isSupabaseConfigured() {
  return (
    SUPABASE_URL !== 'YOUR_SUPABASE_PROJECT_URL' &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
    SUPABASE_URL.startsWith('https://')
  );
}

export { SUPABASE_URL };
