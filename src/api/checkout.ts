// src/api/checkout.ts
import { supabase } from '../lib/supabase';

export type CartItem = { product_id: string; qty: number; unit_price_cents: number };

export async function checkout(items: CartItem[], paymentType: 'CASH'|'CARD'|'E_WALLET' = 'CASH') {
  if (!items.length) throw new Error('Cart is empty');
  const total = items.reduce((s, i) => s + i.qty * i.unit_price_cents, 0);

  // 1) Create sale
  const { data: sale, error: saleErr } = await supabase
    .from('sales')
    .insert({ total_cents: total, paid_cents: total, payment_type: paymentType })
    .select('*')
    .single();
  if (saleErr) throw saleErr;

  // 2) Insert sale items
  const saleItems = items.map(i => ({
    sale_id: sale.id,
    product_id: i.product_id,
    qty: i.qty,
    unit_price_cents: i.unit_price_cents,
    subtotal_cents: i.qty * i.unit_price_cents,
  }));
  const { error: itemsErr } = await supabase.from('sale_items').insert(saleItems);
  if (itemsErr) throw itemsErr;

  // 3) Decrement stock via RPC
  for (const i of items) {
    const { error: decErr } = await supabase.rpc('decrement_stock', {
      p_product_id: i.product_id,
      p_qty: i.qty,
    });
    if (decErr) throw decErr;
  }

  return sale;
}