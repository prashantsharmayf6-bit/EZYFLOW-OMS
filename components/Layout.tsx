import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Bell, Search, User, Settings, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
        isActive
          ? 'bg-primary-50 text-primary-700 font-medium'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

export const Layout: React.FC = () => {
  const { companyName, logo } = useSettings();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3 h-20">
          {logo ? (
            <img src={logo} alt="Logo" className="h-8 w-auto max-w-[2rem] object-contain rounded" />
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">{companyName.charAt(0)}</span>
            </div>
          )}
          <span className="text-xl font-bold text-slate-800 truncate" title={companyName}>{companyName}</span>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Main Menu</div>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/orders" icon={ShoppingCart} label="Orders" />
          <SidebarItem to="/inventory" icon={Package} label="Inventory" />
          <SidebarItem to="/customers" icon={Users} label="Customers" />
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-8">System</div>
          <SidebarItem to="/admin" icon={Settings} label="Administration" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Admin User</p>
              <p className="text-xs text-slate-500">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
          <div className="flex items-center bg-slate-100 rounded-md px-3 py-2 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search orders, products..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};