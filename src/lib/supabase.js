import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper constants for table names based on database.txt
 */
export const TABLES = {
  SIGNATORIES: 'signatories',
  CUSTOMERS: 'customers',
  TITLE_PREFIXES: 'title_prefixes',
};
