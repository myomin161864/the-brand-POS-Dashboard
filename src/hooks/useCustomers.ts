import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Customer, Branch } from '../../types';
import { INITIAL_CUSTOMERS as FALLBACK_CUSTOMERS } from '../../constants';

/**
 * Expected Supabase schema:
 * customers(id text PK, name text, branch text, joined_date date/timestamptz, contact text,
 *           total_orders int, total_dollar numeric, discount_rate text, pages text[])
 */
type CustomerRow = {
  id: string;
  name: string;
  branch: string | null;
  joined_date: string;
  contact: string | null;
  total_orders: number;
  total_dollar: number;
  discount_rate: string | null;
  pages: string[] | null;
};

function toCustomer(r: CustomerRow): Customer {
  const knownBranches = new Set<Branch>([
    'The Idea Plat',
    'The Advisor Plat',
    'The Consultant Plat',
  ]);

  const branchValue: Branch = (r.branch && knownBranches.has(r.branch as Branch))
    ? (r.branch as Branch)
    : 'The Idea Plat';

  return {
    id: r.id,
    name: r.name,
    branch: branchValue,
    joinedDate: r.joined_date,
    contact: r.contact ?? '',
    totalOrders: r.total_orders,
    totalDollar: Number(r.total_dollar),
    discountRate: r.discount_rate ?? '0%',
    pages: r.pages ?? [],
  };
}

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async (): Promise<Customer[]> => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('joined_date', { ascending: false });
      if (error) throw error;

      const mapped = (data as CustomerRow[] | null)?.map(toCustomer) ?? [];
      return mapped.length ? mapped : FALLBACK_CUSTOMERS;
    },
  });
}