import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Admin Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Slide-over Overlay Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw]">
            <AdminSidebar onClose={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm max-w-full overflow-hidden">
          <div className="flex items-center space-x-2 sm:space-x-3 shrink min-w-0 pr-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0 truncate">
              <h2 className="font-serif text-base sm:text-xl text-slate-800 font-bold truncate">
                Admin Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline truncate max-w-[120px]">
                {user?.name || user?.email || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-3 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
