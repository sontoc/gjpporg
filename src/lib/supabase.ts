import { createClient } from '@supabase/supabase-js';

// Retrieve values from environment variables or use the provided fallbacks
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ulgqsblhvvigricteesu.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_y0Q8m6HRWkEEXs3CSYeK0A_z3F7gyEd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
