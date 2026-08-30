import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquareHeart,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Custom Requests', path: '/admin/requests', icon: MessageSquareHeart },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1E293B] text-slate-200 min-h-screen flex flex-col justify-between p-4 shrink-0 shadow-soft-lg">
      
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-700/60">
          <Link to="/" className="block group">
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl tracking-widest text-white font-semibold group-hover:text-[#94BEFA] transition-colors">
                RIZA
              </span>
              <span className="text-[10px] bg-[#4A607A] text-white px-2 py-0.5 rounded-md uppercase font-semibold tracking-wider">
                ADMIN
              </span>
            </div>
            <span className="text-[9px] tracking-super-wide text-slate-400 font-medium uppercase block mt-1">
              STORE OWNER DASHBOARD
            </span>
          </Link>
        </div>

        {/* Storefront Return Button */}
        <Link
          to="/"
          className="flex items-center text-xs font-semibold tracking-wider text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 text-[#94BEFA]" />
          View Live Storefront
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-xs font-medium tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-[#4A607A] text-white font-semibold shadow-soft-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-6 border-t border-slate-700/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>LOGOUT</span>
        </button>
      </div>

    </aside>
  );
}
