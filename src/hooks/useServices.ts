import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Service as ServiceType } from '../../types';
import { INITIAL_SERVICES as FALLBACK_SERVICES } from '../../constants';

/**
 * Expected Supabase schema:
 * services(id serial PK, service_id text unique, name text)
 */
type ServiceRow = { id: number; service_id: string; name: string };

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<ServiceType[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('id,service_id,name')
        .order('name', { ascending: true });
      if (error) throw error;

      const rows = (data as ServiceRow[] | null) ?? [];
      return rows.length
        ? rows.map((s) => ({ id: s.id, serviceId: s.service_id, name: s.name }))
        : FALLBACK_SERVICES;
    },
  });
}