import React from 'react';
import { View, AdminUser } from '../types';
import { 
    OverviewIcon, 
    OrderIcon, 
    ServiceIcon, 
    BranchesIcon, 
    AdminAccessIcon, 
    CustomerDataIcon, 
    FinanceIcon, 
    TalentDataIcon, 
    SettingIcon, 
    BrandIcon,
    UserCircleIcon,
    LogoutIcon,
    ChevronDoubleLeftIcon
} from './Icons';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isCollapsed, setCollapsed, currentUser, onLogout }) => {
  const navItems = [
    { name: 'overview', icon: OverviewIcon },
    { name: 'order', icon: OrderIcon },
    { name: 'service', icon: ServiceIcon },
    { name: 'branches', icon: BranchesIcon },
    { name: 'admin_access', icon: AdminAccessIcon },
    { name: 'customer_data', icon: CustomerDataIcon },
    { name: 'finance', icon: FinanceIcon },
    { name: 'talent_data', icon: TalentDataIcon },
  ].filter(item => currentUser?.permissions[item.name as View]);
  
  const bottomNavItems = [
    { name: 'setting', icon: SettingIcon }
  ].filter(item => currentUser?.permissions[item.name as View]);

  const getButtonClasses = (itemName: View) => {
    if (currentView === itemName) {
      return 'bg-brand-primary text-white';
    }
    return 'text-gray-400 hover:bg-gray-700 hover:text-white';
  };


  return (
    <div className={`flex flex-col h-full bg-brand-secondary transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center h-20 border-b border-gray-800 ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
        <div className={`flex items-center overflow-hidden transition-opacity duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
           <BrandIcon className="w-10 h-10 flex-shrink-0" />
           <h1 className="ml-3 text-2xl font-bold text-gray-100 whitespace-nowrap">The Brand</h1>
        </div>
        <button 
          onClick={() => setCollapsed(!isCollapsed)} 
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg hidden lg:block"
        >
          <ChevronDoubleLeftIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setView(item.name as View)}
            title={isCollapsed ? item.name.replace('_', ' ') : undefined}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out group
              ${getButtonClasses(item.name as View)}
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className={`capitalize font-medium whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3'}`}>{item.name.replace('_', ' ')}</span>
          </button>
        ))}
        <div className="flex-grow"></div>
         {bottomNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setView(item.name as View)}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out group
                  ${getButtonClasses(item.name as View)}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                <span className={`capitalize font-medium whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3'}`}>{item.name}</span>
              </button>
            ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div 
          title={isCollapsed ? currentUser?.name : undefined}
          className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : ''}`}
        >
            <UserCircleIcon className="w-10 h-10 text-gray-500 flex-shrink-0" />
            <div className={`overflow-hidden transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3'}`}>
                <p className="font-semibold text-sm text-gray-100 whitespace-nowrap truncate">{currentUser?.name}</p>
                <p className="text-xs text-gray-400 whitespace-nowrap truncate">{currentUser?.email}</p>
            </div>
        </div>
        <button onClick={onLogout} title={isCollapsed ? 'Logout' : undefined} className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ease-in-out text-gray-400 hover:bg-gray-700 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}>
            <LogoutIcon className="w-6 h-6 flex-shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;