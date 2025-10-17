import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { AdminUser, View, AdminRole, UserStatus } from '../../types';
import { INITIAL_ADMIN_USERS as FALLBACK_ADMINS } from '../../constants';

/**
 * Expected Supabase schema (prototype):
 * admin_users(id uuid default gen_random_uuid(), name text, email text unique, role text,
 *             status text, joined_date date, last_login timestamptz, permissions jsonb, password text)
 * ⚠️ password is only for dev. In production, use Supabase Auth and hashed passwords.
 */
type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined_date: string;
  last_login: string | null;
  permissions: Record<View, boolean> | null;
  password?: string | null;
};

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<AdminUser[]> => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id,name,email,role,status,joined_date,last_login,permissions,password');
      if (error) throw error;

      const rows = (data as AdminRow[] | null) ?? [];
      if (!rows.length) return FALLBACK_ADMINS;

      // Map DB rows → your type. Validate role/status against allowed unions.
      const knownRoles = new Set<AdminRole>(['Founder', 'Manager', 'Supervisor', 'Customer Service Executive']);
      const knownStatuses = new Set<UserStatus>(['Active', 'Inactive']);

      return rows.map((r) => {
        const roleValue: AdminRole = knownRoles.has(r.role as AdminRole) ? (r.role as AdminRole) : 'Manager';
        const statusValue: UserStatus = knownStatuses.has(r.status as UserStatus) ? (r.status as UserStatus) : 'Inactive';

        return {
          id: (Number.isNaN(Number(r.id)) ? Number(new Date().getTime()) : Number(r.id)) as number, // ensure numeric id for UI-only purposes
          name: r.name,
          email: r.email,
          role: roleValue,
          status: statusValue,
          joinedDate: r.joined_date,
          lastLogin: r.last_login ?? undefined,
          permissions: (r.permissions ?? {}) as Partial<Record<View, boolean>>,
          password: r.password ?? 'password123', // dev only
        } as AdminUser;
      });
    },
  });
}
``