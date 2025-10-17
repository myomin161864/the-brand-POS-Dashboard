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

export interface Product {
  id: number;
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
export type AdminRole = 'Founder' | 'Manager' | 'Supervisor' | 'Customer Service Executive';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
  status: UserStatus;
  joinedDate: string; // ISO string
  lastLogin: string; // ISO string
  permissions: Partial<Record<View, boolean>>;
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