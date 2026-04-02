import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sdpujzkddvzbcmmqzrww.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcHVqemtkZHZ6YmNtbXF6cnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzA4MTksImV4cCI6MjA5MDQ0NjgxOX0.Ook9Okhvp1zIsn82B2XerK6y_Tk7ede6VDmeHyBVyYI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
