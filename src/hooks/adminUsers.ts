// src/services/adminUsers.ts
import { createClient } from '@supabase/supabase-js';
import type { AdminUser, AdminRole, UserStatus } from '../../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// DB row -> UI model
function mapRow(row: any): AdminUser {
  return {
    id: row.id,
    display_id: row.display_id,
    auth_user_id: row.auth_user_id ?? null,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    joinedDate: row.joined_date,       // ISO
    lastLogin: row.last_login ?? null, // ISO
  };
}

// LIST
export async function listAdminUsers(search?: string): Promise<AdminUser[]> {
  let q = supabase.from('admin_users').select('*').order('id', { ascending: true });
  if (search?.trim()) {
    const s = `%${search.trim()}%`;
    q = q.or(`name.ilike.${s},email.ilike.${s},role.ilike.${s}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

// CREATE
export async function createAdminUser(input: {
  name: string; email: string; role: AdminRole; status?: UserStatus; auth_user_id?: string|null;
}): Promise<AdminUser> {
  const payload = {
    name: input.name,
    email: input.email,
    role: input.role,
    status: input.status ?? 'Active',
    auth_user_id: input.auth_user_id ?? null,
  };
  const { data, error } = await supabase.from('admin_users').insert(payload).select('*').single();
  if (error) throw error;
  return mapRow(data);
}

// UPDATE
export async function updateAdminUser(id: number, patch: Partial<AdminUser>): Promise<AdminUser> {
  const payload: any = {};
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.email !== undefined) payload.email = patch.email;
  if (patch.role !== undefined) payload.role = patch.role;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.lastLogin !== undefined) payload.last_login = patch.lastLogin;
  if (patch.auth_user_id !== undefined) payload.auth_user_id = patch.auth_user_id;

  const { data, error } = await supabase.from('admin_users').update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return mapRow(data);
}

// DELETE
export async function deleteAdminUser(id: number): Promise<void> {
  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  if (error) throw error;
}