import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#EBF3FA] border-t border-[#D0E2F3] pt-16 pb-12 text-[#2C3E50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#D0E2F3]">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3.5 group">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D0E2F3] shadow-soft-sm shrink-0 bg-white p-0.5 group-hover:scale-105 transition-transform">
                <img src="/assets/logo.png" alt="AurelleCharmsss Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl tracking-widest text-[#2C3E50] font-semibold">
                  AURELLECHARMSSS
                </h2>
                <span className="text-[10px] tracking-super-wide text-[#5C728A] font-medium uppercase block -mt-0.5">
                  HANDMADE WITH LOVE
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#5C728A] leading-relaxed max-w-md">
              Crafting delicate, modern handmade ornaments, bracelets, keychains, and mobile charms designed to bring beauty and joy into your daily routine.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com/aurellecharmsss"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#4A607A] hover:bg-[#D4E4F7] transition-colors border border-[#B8D4F0]"
                title="Instagram (@aurellecharmsss)"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@aurellecharmsss.com"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#4A607A] hover:bg-[#D4E4F7] transition-colors border border-[#B8D4F0]"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5C728A]">
              <li>
                <Link to="/" className="hover:text-[#2C3E50] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#2C3E50] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#2C3E50] transition-colors">
                  About Brand
                </Link>
              </li>
              <li>
                <a href="#custom-orders" className="hover:text-[#2C3E50] transition-colors">
                  Custom Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase mb-4">
              Studio & Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5C728A]">
              <li className="flex items-center">
                <Instagram className="w-4 h-4 mr-2 text-[#4A607A] shrink-0" />
                <a
                  href="https://instagram.com/aurellecharmsss"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2C3E50] underline font-semibold text-[#2C3E50]"
                >
                  @aurellecharmsss
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 text-[#4A607A] mt-0.5 shrink-0" />
                <span>hello@aurellecharmsss.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 text-[#4A607A] mt-0.5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-white border border-[#B8D4F0] text-xs text-[#4A607A]">
              ✨ <strong>Visit our Instagram page</strong> <a href="https://instagram.com/aurellecharmsss" target="_blank" rel="noreferrer" className="underline font-bold text-[#2C3E50]">@aurellecharmsss</a> to see more handcrafted designs & DM us directly for any order inquiries!
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5C728A]">
          <p>© 2026 AURELLECHARMSSS. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0 text-[11px]">
            Handcrafted with <Heart className="w-3 h-3 mx-1 text-rose-400 fill-rose-400" /> for ornament lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
