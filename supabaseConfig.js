import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bnmozbjxpslfoiwrvywr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubW96Ymp4cHNsZm9pd3J2eXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTcwNDAsImV4cCI6MjA2MjgzMzA0MH0.NWIRptRVOd3vfbUjByzP_mRsNCjVnYqJ78QaU0HRJWg';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL ou chave não estão configurados corretamente!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);