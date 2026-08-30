import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="font-serif text-xl text-slate-800 font-semibold">
              RIZA Control Panel
            </h2>
            <p className="text-xs text-slate-500">
              Manage products, custom requests, analytics & store configuration
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-semibold text-slate-700">
                {user?.name || user?.email || 'Store Owner'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
