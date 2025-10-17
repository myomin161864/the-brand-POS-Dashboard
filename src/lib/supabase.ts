import { createClient } from '@supabase/supabase-js';

console.log('SB URL', import.meta.env.VITE_SUPABASE_URL); 
console.log('SB ANON', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0,10));


console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0,10));


export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);