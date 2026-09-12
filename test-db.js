import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('produccion_registro_diario_mina').select('*').limit(1);
  console.log("Data:", data);
  console.log("Error:", error);
}
check();
