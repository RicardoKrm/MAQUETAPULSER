import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function run() {
  const { data: e, error: eErr } = await supabase.from('empresa').select('*').limit(1);
  console.log('Empresa error:', eErr);
  console.log('Empresa length:', e?.length);
}
run();
