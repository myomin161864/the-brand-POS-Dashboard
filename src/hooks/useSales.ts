import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Sale, Product } from '../../types';
import { INITIAL_SALES as FALLBACK_SALES } from '../../constants';

/**
 * Expected Supabase schema:
 * sales(id uuid, total_cents int, paid_cents int, payment_type text, created_at timestamptz)
 * sale_items(id uuid, sale_id uuid, product_id uuid, qty int, unit_price_cents int, subtotal_cents int)
 * products(id uuid, name text, category text, price_cents int, image_url text)
 */
type SaleRow = { id: string; created_at: string; total_cents: number; payment_type: string };
type SaleItemRow = { sale_id: string; product_id: string; qty: number; unit_price_cents: number; subtotal_cents: number };
type ProductRow = { id: string; name: string; category: string | null; price_cents: number; image_url: string | null };

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? 'Uncategorized',
    price: row.price_cents / 100,
    imageUrl: row.image_url ?? undefined,
  };
}

export function useSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async (): Promise<Sale[]> => {
      const { data: sales, error: sErr } = await supabase
        .from('sales')
        .select('id,created_at,total_cents,payment_type')
        .order('created_at', { ascending: false })
        .limit(50);
      if (sErr) throw sErr;

      if (!sales?.length) {
        // Temporary fallback until DB has data
        return FALLBACK_SALES;
      }

      const saleIds = sales.map((s: SaleRow) => s.id);
      const { data: items, error: iErr } = await supabase
        .from('sale_items')
        .select('sale_id,product_id,qty,unit_price_cents,subtotal_cents')
        .in('sale_id', saleIds);
      if (iErr) throw iErr;

      const productIds = Array.from(new Set((items ?? []).map((i: SaleItemRow) => i.product_id)));
      const { data: products, error: pErr } = await supabase
        .from('products')
        .select('id,name,category,price_cents,image_url')
        .in('id', productIds);
      if (pErr) throw pErr;

      const productMap = new Map<string, Product>((products ?? []).map((pr: ProductRow) => [pr.id, toProduct(pr)]));

      return (sales as SaleRow[]).map((s) => {
        const saleItems = (items ?? [])
          .filter((i: SaleItemRow) => i.sale_id === s.id)
          .map((i) => ({
            product: productMap.get(i.product_id)!,
            quantity: i.qty,
          }));

        return {
          id: s.id,
          date: new Date(s.created_at).toISOString().slice(0, 10), // format YYYY-MM-DD
          items: saleItems,
          total: s.total_cents / 100,
        } as Sale;
      });
    },
  });
}