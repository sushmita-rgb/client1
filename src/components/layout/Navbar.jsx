import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SearchModal from '../common/SearchModal';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
        {/* Top announcement bar */}
        <div className="bg-[#EBF3FA] py-1.5 px-2 sm:px-4 text-center text-[10px] sm:text-xs tracking-wider text-[#4A607A] font-medium border-b border-[#D0E2F3] truncate">
          ✨ FREE SHIPPING ON ORDERS OVER ₹999 &nbsp;|&nbsp; HANDCRAFTED WITH LOVE
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Bar: Flex Far Left (Brand) | Center (Nav) | Far Right (Actions) */}
          <div className="flex items-center justify-between h-20 sm:h-24">

            {/* LEFT — Brand Logo & Title (Aligned Far Left) */}
            <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group shrink-0 py-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#D0E2F3] shadow-soft shrink-0 bg-[#FFFDF9] p-1 group-hover:scale-105 transition-transform duration-300">
                <img src="/assets/logo.png" alt="AurelleCharmsss Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-xl md:text-2xl tracking-wider sm:tracking-widest text-[#2C3E50] font-bold group-hover:text-[#4A607A] transition-colors">
                  AURELLECHARMSSS
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-widest sm:tracking-super-wide text-[#5C728A] font-semibold uppercase -mt-0.5 sm:-mt-1">
                  HANDMADE WITH LOVE
                </span>
              </div>
            </Link>

            {/* CENTER — Desktop Nav Links */}
            <nav className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12 mx-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs sm:text-sm tracking-widest uppercase font-semibold transition-all duration-200 relative py-1 ${
                    isActive(link.path)
                      ? 'text-[#2C3E50]'
                      : 'text-[#5C728A] hover:text-[#2C3E50]'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* RIGHT — Search + Auth (Aligned Far Right) */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4 shrink-0">

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#5C728A] hover:text-[#2C3E50] transition-colors rounded-full hover:bg-[#F4EFE6]"
                title="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Logged-in user */}
              {user ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden md:block text-[11px] font-semibold tracking-wider text-[#4A607A] bg-[#EBF3FA] hover:bg-[#D4E4F7] px-3 py-1.5 rounded-full transition-colors border border-[#B8D4F0]"
                    >
                      DASHBOARD
                    </Link>
                  )}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 py-1.5 px-3 rounded-full bg-[#FAF7F2] hover:bg-[#EBF3FA] border border-[#D4E4F7] transition-all duration-200 shadow-soft-sm">
                      <div className="w-6 h-6 rounded-full bg-[#4A607A] text-white flex items-center justify-center text-[11px] font-bold uppercase shrink-0">
                        {(user.name || user.email || 'U').charAt(0)}
                      </div>
                      <span className="text-xs font-bold tracking-wider text-[#2C3E50] max-w-[110px] sm:max-w-[140px] truncate uppercase">
                        Hi, {user.name || user.email?.split('@')[0] || 'User'}
                      </span>
                    </button>

                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-soft-lg border border-[#EBE3D5] py-2 hidden group-hover:block z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-[#FAF7F2]">
                        <p className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-[#2C3E50] truncate mt-0.5">{user.name || user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-xs text-[#4A607A] font-semibold hover:bg-[#FAF7F2]">
                          ⚡ Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-xs tracking-widest font-semibold text-[#5C728A] hover:text-[#2C3E50] transition-colors uppercase px-2 py-1"
                  >
                    Login
                  </Link>
                  <span className="text-[#EBE3D5]">|</span>
                  <Link
                    to="/signup"
                    className="text-xs tracking-widest font-semibold text-[#2C3E50] bg-[#FAF7F2] hover:bg-[#EBF3FA] border border-[#D4E4F7] px-4 py-2 rounded-full transition-colors shadow-soft-sm uppercase"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#5C728A] hover:text-[#2C3E50] rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Over Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] border-b border-[#EBE3D5] px-6 pt-4 pb-6 space-y-4 shadow-soft">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-serif tracking-wider py-2 border-b border-[#FAF7F2] ${
                    isActive(link.path) ? 'text-[#2C3E50] font-semibold' : 'text-[#5C728A]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {user ? (
              <div className="pt-3 border-t border-[#EBE3D5] space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#EBE3D5]">
                  <div className="w-9 h-9 rounded-full bg-[#4A607A] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {(user.name || user.email || 'U').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#2C3E50] truncate">Hi, {user.name || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-[#5C728A] truncate">{user.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-xs font-semibold py-2.5 rounded-full bg-[#EBF3FA] text-[#4A607A] border border-[#B8D4F0] uppercase tracking-wider"
                  >
                    ⚡ Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center text-xs font-semibold py-2.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center text-xs font-semibold py-2.5 rounded-full border border-[#D4E4F7] text-[#5C728A] uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center text-xs font-semibold py-2.5 rounded-full bg-[#2C3E50] text-white uppercase tracking-widest"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
