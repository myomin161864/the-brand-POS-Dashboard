import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { BranchInfo } from '../../types';
import { INITIAL_BRANCHES as FALLBACK_BRANCHES } from '../../constants';

/**
 * Expected Supabase schema:
 * branches(id serial PK, name text, link text)
 */
type BranchRow = { id: number; name: string; link: string | null };

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: async (): Promise<BranchInfo[]> => {
      const { data, error } = await supabase
        .from('branches')
        .select('id,name,link')
        .order('name', { ascending: true });
      if (error) throw error;

      const rows = (data as BranchRow[] | null) ?? [];
      return rows.length
        ? rows.map((b) => ({ id: b.id, name: b.name, link: b.link ?? '' }))
        : FALLBACK_BRANCHES;
    },
  });
}

export default useBranches;