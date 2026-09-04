import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://yyqpftzcrdochlysfseg.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXBmdHpjcmRvY2hseXNmc2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTQ1MDMsImV4cCI6MjEwNDA5MDUwM30.L_AvMmt-5RX3b_RCAb4lblyJanHzQJn5anCMjzNV0Lk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

