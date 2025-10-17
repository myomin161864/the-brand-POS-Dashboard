// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Product } from '../../types'



type ProductRow = {
  id: string;
  name: string;
  category: string | null;
  price_cents: number;
  image_url: string | null;
  active: boolean;
};



function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? 'Uncategorized',
    price: row.price_cents / 100,
    imageUrl: row.image_url ?? undefined,
  };
}




export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,category,price_cents,image_url,active')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return (data ?? []).map(toProduct);
    },
  });
}
