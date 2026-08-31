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
        <div className="bg-[#EBF3FA] py-1.5 px-4 text-center text-xs tracking-wider text-[#4A607A] font-medium border-b border-[#D0E2F3]">
          ✨ FREE SHIPPING ON ORDERS OVER ₹999 &nbsp;|&nbsp; HANDCRAFTED WITH LOVE
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-column grid: Brand | Nav | Actions */}
          <div className="grid grid-cols-3 items-center h-20">

            {/* LEFT — Brand */}
            <Link to="/" className="flex flex-col group w-fit">
              <span className="font-serif text-xl sm:text-2xl tracking-widest text-[#2C3E50] font-semibold group-hover:text-[#4A607A] transition-colors">
                AURELLECHARMSSS
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-super-wide text-[#5C728A] font-medium uppercase -mt-1">
                HANDMADE WITH LOVE
              </span>
            </Link>

            {/* CENTER — Desktop Nav Links (perfectly centred by grid) */}
            <nav className="hidden md:flex items-center justify-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm tracking-widest uppercase font-medium transition-all duration-200 relative py-1 ${
                    isActive(link.path)
                      ? 'text-[#2C3E50] font-semibold'
                      : 'text-[#5C728A] hover:text-[#2C3E50]'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF37] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* RIGHT — Search + Auth */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4">

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
                      className="hidden sm:block text-xs font-semibold tracking-wider text-[#4A607A] bg-[#EBF3FA] hover:bg-[#D4E4F7] px-3 py-1.5 rounded-full transition-colors border border-[#B8D4F0]"
                    >
                      DASHBOARD
                    </Link>
                  )}
                  <div className="relative group">
                    <button className="flex items-center p-1.5 rounded-full hover:bg-[#F4EFE6] transition-colors">
                      <User className="w-5 h-5 text-[#5C728A]" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft border border-[#EBE3D5] py-2 hidden group-hover:block z-50">
                      <div className="px-4 py-2 border-b border-[#FAF7F2]">
                        <p className="text-xs text-[#94A3B8]">Signed in as</p>
                        <p className="text-sm font-medium text-[#2C3E50] truncate">{user.name || user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-xs text-[#4A607A] font-medium hover:bg-[#FAF7F2]">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center"
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
                    className="text-xs tracking-widest font-medium text-[#5C728A] hover:text-[#2C3E50] transition-colors uppercase"
                  >
                    Login
                  </Link>
                  <span className="text-[#EBE3D5]">|</span>
                  <Link
                    to="/signup"
                    className="text-xs tracking-widest font-medium text-[#2C3E50] bg-[#FAF7F2] hover:bg-[#EBF3FA] border border-[#D4E4F7] px-3.5 py-1.5 rounded-full transition-colors shadow-soft-sm uppercase"
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

            {!user && (
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
