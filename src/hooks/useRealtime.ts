// src/hooks/useRealtime.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const ch = supabase
      .channel('pos-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => qc.invalidateQueries({ queryKey: ['products'] })
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sales' },
        () => qc.invalidateQueries({ queryKey: ['recent-sales'] })
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [qc]);
}