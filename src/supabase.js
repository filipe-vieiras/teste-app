import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cqtamgtugcxinyfuvvsn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGFtZ3R1Z2N4aW55ZnV2dnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIyMDYsImV4cCI6MjA1NjM0ODIwNn0.3aVTbU34dC4P1boumtNY4uwww-O2thiOX_QH0f5eA7s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);