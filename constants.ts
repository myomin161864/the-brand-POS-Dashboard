// FIX: Provided initial data constants to allow the application to run with a default dataset.
import { Product, Sale, Customer, AdminUser, BranchInfo, Service, View } from './types';

const allPermissions: Partial<Record<View, boolean>> = {
  overview: true,
  order: true,
  service: true,
  branches: true,
  admin_access: true,
  customer_data: true,
  finance: true,
  talent_data: true,
  setting: true,
};

const managerPermissions: Partial<Record<View, boolean>> = {
  ...allPermissions,
  admin_access: false,
};

const supervisorPermissions: Partial<Record<View, boolean>> = {
  ...managerPermissions,
  finance: false,
  talent_data: false,
};

const csePermissions: Partial<Record<View, boolean>> = {
  overview: true,
  order: true,
  service: true,
  customer_data: true,
};


export const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: 'Americano', category: 'Coffee', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1579992305312-3a3d5cf3793d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
  { id: "2", name: 'Latte', category: 'Coffee', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1561882468-91101f2e5f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
  { id: "3", name: 'Cappuccino', category: 'Coffee', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1557006021-b1da71168341?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
  { id: "4", name: 'Croissant', category: 'Pastry', price: 2.75, imageUrl: 'https://images.unsplash.com/photo-1587665991830-2a543f07a102?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
  { id: "5", name: 'Muffin', category: 'Pastry', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
  { id: "6", name: 'Iced Tea', category: 'Beverage', price: 2.25, imageUrl: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
  { id: "7", name: 'Sandwich', category: 'Food', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
];

export const INITIAL_SALES: Sale[] = [
  { id: 'SALE001', date: '2023-10-01', items: [{ product: INITIAL_PRODUCTS[0], quantity: 2 }, { product: INITIAL_PRODUCTS[3], quantity: 1 }], total: 7.75 },
  { id: 'SALE002', date: '2023-10-01', items: [{ product: INITIAL_PRODUCTS[1], quantity: 1 }], total: 3.50 },
  { id: 'SALE003', date: '2023-10-02', items: [{ product: INITIAL_PRODUCTS[2], quantity: 1 }, { product: INITIAL_PRODUCTS[4], quantity: 2 }], total: 9.50 },
  { id: 'SALE004', date: '2023-10-03', items: [{ product: INITIAL_PRODUCTS[6], quantity: 1 }, { product: INITIAL_PRODUCTS[5], quantity: 1 }], total: 8.75 },
  { id: 'SALE005', date: '2023-10-04', items: [{ product: INITIAL_PRODUCTS[0], quantity: 1 }, { product: INITIAL_PRODUCTS[1], quantity: 1 }, { product: INITIAL_PRODUCTS[2], quantity: 1 }], total: 9.50 },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'TBI0001', name: 'Alice Johnson', branch: 'The Idea Plat', joinedDate: '2023-01-15', contact: 'alice@email.com', totalOrders: 5, totalDollar: 150.75, discountRate: '5%', pages: ['facebook.com/alice'] },
  { id: 'TBA0001', name: 'Bob Smith', branch: 'The Advisor Plat', joinedDate: '2023-02-20', contact: 'bob@email.com', totalOrders: 8, totalDollar: 250.00, discountRate: '10%', pages: [] },
  { id: 'TBC0001', name: 'Charlie Brown', branch: 'The Consultant Plat', joinedDate: '2023-03-10', contact: 'charlie@email.com', totalOrders: 2, totalDollar: 80.50, discountRate: '0%', pages: ['linkedin.com/in/charlie', 'twitter.com/charlie'] },
];

// export const INITIAL_ADMIN_USERS: AdminUser[] = [
//     { id: 1, name: 'Super Admin', email: 'super@thebrand.com', role: 'Founder', password: 'password123', status: 'Active', joinedDate: '2023-01-01', lastLogin: new Date().toISOString(), permissions: allPermissions },
//     { id: 2, name: 'Manager Mike', email: 'manager@thebrand.com', role: 'Manager', password: 'password123', status: 'Active', joinedDate: '2023-02-01', lastLogin: new Date().toISOString(), permissions: managerPermissions },
//     { id: 3, name: 'Supervisor Sarah', email: 'supervisor@thebrand.com', role: 'Supervisor', password: 'password123', status: 'Active', joinedDate: '2023-03-01', lastLogin: new Date().toISOString(), permissions: supervisorPermissions },
//     { id: 4, name: 'CSE Chris', email: 'cse@thebrand.com', role: 'Customer Service Executive', password: 'password123', status: 'Inactive', joinedDate: '2023-04-01', lastLogin: '2023-09-01T10:00:00.000Z', permissions: csePermissions },
// ];

export const INITIAL_BRANCHES: BranchInfo[] = [
    { id: 1, name: 'The Idea Plat', link: 'https://ideaplat.com' },
    { id: 2, name: 'The Advisor Plat', link: 'https://advisorplat.com' },
    { id: 3, name: 'The Consultant Plat', link: 'https://consultantplat.com' },
];

export const INITIAL_SERVICES: Service[] = [
    { id: 1, serviceId: 'CONSULT-01', name: 'Business Consultation' },
    { id: 2, serviceId: 'MKT-PLAN-01', name: 'Marketing Plan' },
    { id: 3, serviceId: 'SMM-01', name: 'Social Media Management' },
    { id: 4, serviceId: 'WEB-DESIGN-01', name: 'Website Design' },
];