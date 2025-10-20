// src/api/auth.ts
import { supabase } from '../lib/supabase';


import { useEffect } from 'react';

export default function DebugSupabase() {
  useEffect(() => {
    (async () => {
      // 1) Who am I?
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Logged in as:', user?.email);

      // 2) Can I read admins?
      const { data: admins, error: readErr } = await supabase
        .from('admin_users')
        .select('*')
        .limit(3);
      console.log('readErr:', readErr, 'admins:', admins);

      // 3) Try a minimal insert
      const { data: inserted, error: insErr } = await supabase
        .from('admin_users')
        .insert({ name: 'Check', email: 'check@thebrand.com', role: 'Staff', status: 'Active' })
        .select('*');
      console.log('insErr:', insErr, 'inserted:', inserted);
    })();
  }, []);

  return "check console for Supabase debug info";
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}