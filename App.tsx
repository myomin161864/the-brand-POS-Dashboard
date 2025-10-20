// src/App.tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import CustomerData from './components/CustomerData';
import AdminAccess from './components/AdminAccess';
import Branches from './components/Branches';
import Service from './components/Service';
import Login from './components/Login';
import { View, Product, Sale, Customer, AdminUser, BranchInfo, Service as ServiceType } from './types';
import { MenuIcon } from './components/Icons';
import 'tailwindcss';

// 🧠 Supabase data hooks (created in /src/hooks per our previous steps)
import { useProducts } from './src/hooks/useProducts.ts';
import { useSales } from './src/hooks/useSales.ts';
import { useCustomers } from './src/hooks/useCustomers';
import { useAdminUsers } from './src/hooks/useAdminUsers';
import { useBranches } from './src/hooks/useBranches';
import { useServices } from './src/hooks/useServices';
import { supabase } from './src/lib/supabase';

// Create a single QueryClient and provide it above the component that uses hooks
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

function AppInner() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Global UI State
  const [currentView, setCurrentView] = useState<View>('overview');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔗 QueryClient for manual refetch after mutations
  const qc = useQueryClient();

  // 🔄 Load data from Supabase (with temporary fallbacks handled inside hooks)
  const { data: products = [], isLoading: loadingProducts, error: errProducts } = useProducts();
  const { data: sales = [], isLoading: loadingSales, error: errSales, refetch: refetchSales } = useSales();
  const { data: customers = [], isLoading: loadingCustomers, error: errCustomers, refetch: refetchCustomers } = useCustomers();
  const { data: adminUsers = [], isLoading: loadingAdmins, error: errAdmins, refetch: refetchAdmins } = useAdminUsers();
  const { data: branches = [], isLoading: loadingBranches, error: errBranches, refetch: refetchBranches } = useBranches();
  const { data: services = [], isLoading: loadingServices, error: errServices, refetch: refetchServices } = useServices();

  const isLoadingAny = loadingProducts || loadingSales || loadingCustomers || loadingAdmins || loadingBranches || loadingServices;
  const firstError = errProducts?.message || errSales?.message || errCustomers?.message || errAdmins?.message || errBranches?.message || errServices?.message;

  // 🔐 Authentication Logic (prototype)
  
const handleLogin = async (email: string, password: string): Promise<boolean> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Login failed:', error.message);
    return false;
  }

  const { data: userData } = await supabase.auth.getUser();
  const authUserId = userData?.user?.id;
  if (!authUserId) return false;

  // Try to fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  // If no profile, create one on the fly (optional)
  if (profileError) {
    const { error: insertErr } = await supabase.from('admin_users').insert({
      auth_user_id: authUserId,
      email,
      name: email.split('@')[0],
      role: 'Manager',
      status: 'Active',
      joined_date: new Date().toISOString(),
      last_login: null,
    });
    if (insertErr) {
      console.error('Failed to create profile:', insertErr.message);
      return false;
    }
    // Re-fetch the new profile
    const { data: created } = await supabase
      .from('admin_users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();
    if (!created) return false;
    setCurrentUser(created as AdminUser);
    return true;
  }

  if (profile?.status !== 'Active') return false;
  setCurrentUser(profile as AdminUser);

  // Optional: update last_login
  await supabase.from('admin_users').update({ last_login: new Date().toISOString() }).eq('auth_user_id', authUserId);
  return true;
};



  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };


  // 💳 Create sale: write to Supabase, then refetch
  // newSaleData.items: [{ product, quantity }]
  const handleAddSale = async (newSaleData: Omit<Sale, 'id' | 'date'>) => {
    // Compute total in cents (DB layer stores cents)
    const items = newSaleData.items.map(i => ({
      product_id: i.product.id as unknown as string, // Product.id must be string (uuid)
      qty: i.quantity,
      unit_price_cents: Math.round(i.product.price * 100),
      subtotal_cents: Math.round(i.quantity * i.product.price * 100),
    }));
    const total_cents = items.reduce((s, i) => s + i.subtotal_cents, 0);

    // 1) Create sale row
    const { data: sale, error: saleErr } = await supabase
      .from('sales')
      .insert({
        total_cents,
        paid_cents: total_cents,
        payment_type: 'CASH', // or pass via POS
      })
      .select('*')
      .single();
    if (saleErr) {
      console.error(saleErr);
      return;
    }

    // 2) Insert sale_items
    const saleItems = items.map(i => ({
      sale_id: sale.id,
      product_id: i.product_id,
      qty: i.qty,
      unit_price_cents: i.unit_price_cents,
      subtotal_cents: i.subtotal_cents,
    }));
    const { error: itemsErr } = await supabase.from('sale_items').insert(saleItems);
    if (itemsErr) {
      console.error(itemsErr);
      return;
    }

    // 3) Decrement stock via RPC
    for (const i of items) {
      const { error: decErr } = await supabase.rpc('decrement_stock', {
        p_product_id: i.product_id,
        p_qty: i.qty,
      });
      if (decErr) {
        console.error(decErr);
        // optional: rollback or notify
      }
    }

    // 4) Refresh queries (sales and products stock)
    await Promise.all([
      refetchSales(),
      qc.invalidateQueries({ queryKey: ['products'] }),
    ]);
  };

  // 👥 Customers — CRUD via Supabase
  const handleAddCustomer = async (newCustomer: Customer) => {
    const { error } = await supabase.from('customers').insert({
      id: newCustomer.id,
      name: newCustomer.name,
      branch: newCustomer.branch,
      joined_date: newCustomer.joinedDate,
      contact: newCustomer.contact,
      total_orders: newCustomer.totalOrders,
      total_dollar: newCustomer.totalDollar,
      discount_rate: newCustomer.discountRate,
      pages: newCustomer.pages,
    });
    if (!error) await refetchCustomers();
  };

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    const { error } = await supabase
      .from('customers')
      .update({
        name: updatedCustomer.name,
        branch: updatedCustomer.branch,
        joined_date: updatedCustomer.joinedDate,
        contact: updatedCustomer.contact,
        total_orders: updatedCustomer.totalOrders,
        total_dollar: updatedCustomer.totalDollar,
        discount_rate: updatedCustomer.discountRate,
        pages: updatedCustomer.pages,
      })
      .eq('id', updatedCustomer.id);
    if (!error) await refetchCustomers();
  };

  const onDeleteCustomer = async (customerId: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', customerId);
    if (!error) await refetchCustomers();
  };

  // 👤 Admin Users — prototype CRUD (Supabase table: admin_users)
  // NOTE: If your admin_users table uses UUIDs but your type uses number,
  // either switch the type to string or use a numeric primary key in the table.
  
const handleAddUser = async (newUser: AdminUser) => {
  // if you already created the Auth user server-side, you'll have auth_user_id here
  const { error } = await supabase.from('admin_users').insert({
    auth_user_id: newUser.auth_user_id ?? null,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status ?? 'Active',
    joined_date: new Date().toISOString(),
    last_login: null,
  });
  if (!error) await refetchAdmins();
};


  const handleUpdateUser = async (updatedUser: AdminUser) => {
    const { error } = await supabase
      .from('admin_users')
      .update({
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        joined_date: updatedUser.joinedDate,
        last_login: updatedUser.lastLogin ?? null,
        // password: updatedUser.password, // ⚠️ dev only
      })
      .eq('email', updatedUser.email); // choose your unique key (email recommended)
    if (!error) {
      await refetchAdmins();
      if (currentUser && currentUser.email === updatedUser.email) {
        setCurrentUser(updatedUser);
      }
    }
  };

  const onDeleteUser = async (userId: string) => {
  const { error } = await supabase.from('admin_users').delete().eq('id', userId);
  if (!error) await refetchAdmins();
};

  // 🏬 Branches
  const handleAddBranch = async (newBranch: BranchInfo) => {
    const { error } = await supabase.from('branches').insert(newBranch);
    if (!error) await refetchBranches();
  };
  const handleUpdateBranch = async (updatedBranch: BranchInfo) => {
    const { error } = await supabase.from('branches').update(updatedBranch).eq('id', updatedBranch.id);
    if (!error) await refetchBranches();
  };
  const onDeleteBranch = async (branchId: number) => {
    const { error } = await supabase.from('branches').delete().eq('id', branchId);
    if (!error) await refetchBranches();
  };

  // 🛠️ Services
  const handleAddService = async (newService: ServiceType) => {
    const { error } = await supabase.from('services').insert(newService);
    if (!error) await refetchServices();
  };
  const handleUpdateService = async (updatedService: ServiceType) => {
    const { error } = await supabase.from('services').update(updatedService).eq('id', updatedService.id);
    if (!error) await refetchServices();
  };
  const onDeleteService = async (serviceId: number) => {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);
    if (!error) await refetchServices();
  };

  // 🔎 Render Logic
  const renderView = () => {
  
if (!currentUser?.permissions?.[currentView]) {
  return <div className="p-8 text-white">You do not have permission to view this page.</div>;
}


    switch (currentView) {
      case 'overview':
        return <Dashboard sales={sales as Sale[]} />;

      case 'order':
        return <POS products={products as Product[]} onAddSale={handleAddSale} />;

      case 'customer_data':
        return (
          <CustomerData
            customers={customers as Customer[]}
            onAddCustomer={handleAddCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onDeleteCustomer={onDeleteCustomer}
          />
        );

      case 'admin_access':
        return (
          <AdminAccess
            users={adminUsers as AdminUser[]}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        );

      case 'branches':
        return (
          <Branches
            branches={branches as BranchInfo[]}
            onAddBranch={handleAddBranch}
            onUpdateBranch={handleUpdateBranch}
            onDeleteBranch={onDeleteBranch}
          />
        );

      case 'service':
        return (
          <Service
            services={services as ServiceType[]}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={onDeleteService}
          />
        );

      default:
        return <div className="p-8 text-white">{currentView} page coming soon...</div>;
    }
  };

  if (!currentUser) {
    // Block UI while initial data loads (so login list is ready)
    if (isLoadingAny) return <div className="p-8 text-white">Loading…</div>;
    if (firstError) return <div className="p-8 text-red-400">Failed to load: {firstError}</div>;
    return <Login onLogin={handleLogin} />;
  }

  
  return (
    <div className="flex h-screen bg-brand-background text-gray-100 font-sans">
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
        <Sidebar
          currentView={currentView}
          setView={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-20 px-6 bg-brand-secondary border-b border-gray-800 lg:hidden">
          <h1 className="text-xl font-bold uppercase">{currentView.replace('_', ' ')}</h1>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{renderView()}</div>
      </main>
    </div>
  );
}