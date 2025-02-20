import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cutsrniwvadkiuzparie.supabase.coCT_URL';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1dHNybml3dmFka2l1enBhcmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTMyMjAsImV4cCI6MjA1MzEyOTIyMH0.P3QZDCiZhwmcpEBNXDtB5R1PImvanJ7w4_ovsIVKVxI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);