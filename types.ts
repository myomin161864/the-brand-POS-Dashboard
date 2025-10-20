export type View ='admin_access';

export interface AdminUser {
  id: string | null;              // UUID (DB PK)
  auth_user_id: string | null;
  display_id?: string; // numeric or string for UI
  name: string;
  email: string;
  phone: number;
  role: 'Owner' | 'Manager' | 'Admin';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastLogin: string | null;
}