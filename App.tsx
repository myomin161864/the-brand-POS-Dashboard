import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POS from './components/POS';
import CustomerData from './components/CustomerData';
import AdminAccess from './components/AdminAccess';
import Branches from './components/Branches';
import Service from './components/Service';
import Login from './components/Login';
import { View, Product, Sale, Customer, AdminUser, BranchInfo, Service as ServiceType } from './types';
import { INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_CUSTOMERS, INITIAL_ADMIN_USERS, INITIAL_BRANCHES, INITIAL_SERVICES } from './constants';
import { MenuIcon } from './components/Icons';
import "tailwindcss";

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Global UI State
  const [currentView, setCurrentView] = useState<View>('overview');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [branches, setBranches] = useState<BranchInfo[]>(INITIAL_BRANCHES);
  const [services, setServices] = useState<ServiceType[]>(INITIAL_SERVICES);

  // Authentication Logic
  const handleLogin = (email: string, password: string): boolean => {
    const user = adminUsers.find(u => u.email === email && u.password === password);
    if (user && user.status === 'Active') {
      setCurrentUser(user);
      // Set the first available view as default
      const firstView = Object.keys(user.permissions).find(p => user.permissions[p as View]) as View || 'overview';
      setCurrentView(firstView);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // CRUD Handlers
  const handleAddSale = (newSaleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...newSaleData,
      id: `SALE${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    };
    setSales(prevSales => [newSale, ...prevSales]);
  };
  
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };
  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  const onDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const handleAddUser = (newUser: AdminUser) => {
    setAdminUsers(prev => [...prev, newUser]);
  };
  const handleUpdateUser = (updatedUser: AdminUser) => {
    setAdminUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };
  const onDeleteUser = (userId: number) => {
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
  };
  
  const handleAddBranch = (newBranch: BranchInfo) => {
    setBranches(prev => [...prev, newBranch]);
  };
  const handleUpdateBranch = (updatedBranch: BranchInfo) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };
  const onDeleteBranch = (branchId: number) => {
    setBranches(prev => prev.filter(b => b.id !== branchId));
  };

  const handleAddService = (newService: ServiceType) => {
    setServices(prev => [...prev, newService]);
  };
  const handleUpdateService = (updatedService: ServiceType) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };
  const onDeleteService = (serviceId: number) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };
  
  // Render Logic
  const renderView = () => {
    if (!currentUser?.permissions[currentView]) {
        return <div className="p-8 text-white">You do not have permission to view this page.</div>;
    }

    switch (currentView) {
      case 'overview':
        return <Dashboard sales={sales} />;
      case 'order':
        return <POS products={products} onAddSale={handleAddSale} />;
      case 'customer_data':
        return <CustomerData customers={customers} onAddCustomer={handleAddCustomer} onUpdateCustomer={handleUpdateCustomer} onDeleteCustomer={onDeleteCustomer} />;
      case 'admin_access':
        return <AdminAccess users={adminUsers} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={onDeleteUser} />;
      case 'branches':
        return <Branches branches={branches} onAddBranch={handleAddBranch} onUpdateBranch={handleUpdateBranch} onDeleteBranch={onDeleteBranch} />;
      case 'service':
        return <Service services={services} onAddService={handleAddService} onUpdateService={handleUpdateService} onDeleteService={onDeleteService} />;
      default:
        return <div className="p-8 text-white">{currentView} page coming soon...</div>;
    }
  };

  if (!currentUser) {
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
       {isMobileMenuOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-20 px-6 bg-brand-secondary border-b border-gray-800 lg:hidden">
            <h1 className="text-xl font-bold uppercase">{currentView.replace('_', ' ')}</h1>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
                <MenuIcon className="w-6 h-6" />
            </button>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
