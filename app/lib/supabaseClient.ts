// app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token'
  }
});

// Log authentication errors in development
if (process.env.NODE_ENV !== 'production') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(`Supabase auth event: ${event}`, session ? 'Session exists' : 'No session');
  });
}