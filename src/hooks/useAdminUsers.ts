import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { AdminUser, View, AdminRole, UserStatus } from '../../types';

// Match your DB columns
type AdminRow = {
  id: string;        
  display_id: string | number;           // may be numeric id or uuid
  auth_user_id: string | null;      // uuid or null
  name: string;
  email: string;
  role: string;
  status: string;
  joined_date: string;
  last_login: string | null;
  permissions: Record<View, boolean> | null;
  // password?: string | null;       // only if this column truly exists
};

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data, error } = await supabase
        .from('admin_users')
        // Include display_id and auth_user_id; remove password unless your table has it
        .select('id,display_id,auth_user_id,name,email,role,status,joined_date,last_login,permissions');

      if (error) throw error;

      const rows = (data as AdminRow[] | null) ?? [];
      if (!rows.length) return []; // ✅ no static fallback

      // Deduplicate by email (keep latest by joined_date)
      const byEmail = new Map<string, AdminRow>();
      for (const r of rows) {
        const prev = byEmail.get(r.email);
        if (!prev || new Date(r.joined_date) > new Date(prev.joined_date)) {
          byEmail.set(r.email, r);
        }
      }

      const knownRoles = new Set<AdminRole>(['Owner', 'Manager', 'Staff']);
      const knownStatuses = new Set<UserStatus>(['Active', 'Inactive']);

      return Array.from(byEmail.values()).map((r): AdminUser => ({
        id: r.id,
        display_id: r.display_id,                       // keep uuid
        auth_user_id: r.auth_user_id ?? null,
        name: r.name,
        email: r.email,
        role: knownRoles.has(r.role as AdminRole) ? (r.role as AdminRole) : 'Staff',
        status: knownStatuses.has(r.status as UserStatus) ? (r.status as UserStatus) : 'Inactive',
        joinedDate: new Date(r.joined_date).toISOString(),
        lastLogin: r.last_login ? new Date(r.last_login).toISOString() : null,
        permissions: (r.permissions ?? {}) as Partial<Record<View, boolean>>,
        // password: r.password ?? undefined, // only if you really keep this in DB
      }));
    },
    // Optional: prefill as empty array to avoid undefined flashes
    initialData: [],
  });
}