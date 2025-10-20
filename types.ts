// FIX: Provided full implementation of types to resolve module and type errors across the application.
export type View =
  | 'overview'
  | 'order'
  | 'service'
  | 'branches'
  | 'admin_access'
  | 'customer_data'
  | 'finance'
  | 'talent_data'
  | 'setting';

export type Product ={
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  total: number;
}

export type Branch = 'The Idea Plat' | 'The Advisor Plat' | 'The Consultant Plat';

export interface Customer {
    id: string;
    name: string;
    branch: Branch;
    joinedDate: string; // ISO string
    contact: string;
    totalOrders: number;
    totalDollar: number;
    discountRate: string;
    pages: string[];
}

export type UserStatus = 'Active' | 'Inactive';
export type AdminRole = 'Owner' | 'Manager' | 'Staff';


export type CreateAdminUserInput = {
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Staff';
  status?: 'Active' | 'Inactive';
  auth_user_id?: string | null; // set after creating Auth user (Admin API)
};



export interface AdminUser {
  id: string;                // UUID (DB PK)
  display_id?: string | number; // numeric or string for UI
  auth_user_id: string | null;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Staff';
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastLogin: string | null;
  permissions?: Partial<Record<View, boolean>>;
}




export interface BranchInfo {
    id: number;
    name: string;
    link: string;
}

export interface Service {
    id: number;
    serviceId: string;
    name: string;
}

