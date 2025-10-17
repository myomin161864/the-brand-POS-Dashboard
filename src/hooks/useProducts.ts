// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, name, price_cents, stock_qty, category')
        .eq('active', true)
        .order('name', { ascending: true });
      if (error) throw error;
      return data!;
    },
  });
}