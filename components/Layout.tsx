import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Bell, Search, User, Settings, Users, LogOut, Menu, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: React.ElementType, label: string, onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
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
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8 w-auto max-w-[2rem] object-contain rounded" />
            ) : (
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">{companyName.charAt(0)}</span>
              </div>
            )}
            <span className="text-xl font-bold text-slate-800 truncate" title={companyName}>{companyName}</span>
          </div>
          {/* Mobile Close Button */}
          <button onClick={closeMobileMenu} className="md:hidden text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">Main Menu</div>
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={closeMobileMenu} />
          <SidebarItem to="/orders" icon={ShoppingCart} label="Orders" onClick={closeMobileMenu} />
          <SidebarItem to="/inventory" icon={Package} label="Inventory" onClick={closeMobileMenu} />
          <SidebarItem to="/customers" icon={Users} label="Customers" onClick={closeMobileMenu} />
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4 mt-8">System</div>
          <SidebarItem to="/admin" icon={Settings} label="Administration" onClick={closeMobileMenu} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 mb-2">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              closeMobileMenu();
            }}
            className="w-full flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-20 shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
             {/* Mobile Menu Toggle */}
             <button 
               onClick={toggleMobileMenu}
               className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
             >
               <Menu className="w-6 h-6" />
             </button>

             {/* Search Bar */}
             <div className="flex items-center bg-slate-100 rounded-md px-3 py-2 w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400 min-w-0"
                />
             </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 ml-2">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};