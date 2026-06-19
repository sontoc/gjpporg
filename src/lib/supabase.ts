import { createClient } from '@supabase/supabase-js';

// Retrieve values from environment variables or use the provided fallbacks
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ulgqsblhvvigricteesu.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_y0Q8m6HRWkEEXs3CSYeK0A_z3F7gyEd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    // Elegant custom fetch wrapper to intercept and catch client 'Failed to fetch' exceptions.
    // This translates network disconnects/blocked domains into a standard clean API 503 response,
    // protecting the application runtime from uncaught fetch crashes and console exception noise.
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        return await fetch(input, init);
      } catch (error: any) {
        const isFetchError = error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('fetch') || 
           error.message.includes('NetworkError') ||
           error.name === 'TypeError');
           
        if (isFetchError) {
          console.warn("[Offline Fallback] Intercepted network connection error to Supabase. Gracefully fallback.");
          return new Response(JSON.stringify({ 
            error: {
              message: "Network connection unavailable. Operating in offline fallback mode.",
              status: 503
            }
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        throw error;
      }
    }
  }
});

