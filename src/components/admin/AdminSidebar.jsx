import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquareHeart,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Custom Requests', path: '/admin/requests', icon: MessageSquareHeart },
    { name: 'Product Enquiries', path: '/admin/inquiries', icon: ShoppingBag },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#1E293B] text-slate-200 min-h-screen flex flex-col justify-between p-4 shrink-0 shadow-soft-lg">
      
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-700/60">
          <Link to="/" className="block group">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-600 bg-white p-0.5 shrink-0 group-hover:scale-105 transition-transform">
                <img src="/assets/logo.png" alt="AurelleCharmsss Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-serif text-base tracking-wider text-white font-semibold group-hover:text-[#94BEFA] transition-colors truncate">
                    AURELLECHARMSSS
                  </span>
                  <span className="text-[9px] bg-[#4A607A] text-white px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider shrink-0">
                    ADMIN
                  </span>
                </div>
                <span className="text-[8px] tracking-widest text-slate-400 font-medium uppercase block mt-0.5 truncate">
                  STORE OWNER DASHBOARD
                </span>
              </div>
            </div>
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
                onClick={() => { if (onClose) onClose(); }}
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
