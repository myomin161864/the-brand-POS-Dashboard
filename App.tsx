// src/App.tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import AdminAccess from './components/AdminAccess';
import { View, AdminUser } from './types';
import { MenuIcon } from './components/Icons';
import 'tailwindcss';

// 🧠 Supabase data hooks (created in /src/hooks per our previous steps)
import { useAdminUsers } from './src/hooks/useAdminUsers';
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

  // Global UI State
  const [currentView, setCurrentView] = useState<View>('overview');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 🔗 QueryClient for manual refetch after mutations
  const qc = useQueryClient();

  // 🔄 Load data from Supabase (with temporary fallbacks handled inside hooks)
  const { data: adminUsers = [], isLoading: loadingAdmins, error: errAdmins, refetch: refetchAdmins } = useAdminUsers();
  
  const renderView = () => {
    if(currentView){
        return (
              <AdminAccess
                users={adminUsers as AdminUser[]}
                // onAddUser={handleAddUser}
                // onUpdateUser={handleUpdateUser}
                // onDeleteUser={onDeleteUser}
              />
        );
    }
  }
  

  return (
    <div className="flex h-screen bg-brand-background text-gray-100 font-sans">
      <div className={`fixed inset-y-0 left-0 z-30 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-20 px-6 bg-brand-secondary border-b border-gray-800 lg:hidden">
          <h1 className="text-xl font-bold uppercase">Test H1</h1>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{renderView()}</div>
      </main>
    </div>
  );
}