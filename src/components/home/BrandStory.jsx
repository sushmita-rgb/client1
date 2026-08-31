import React from 'react';
import { Heart, Sparkles, Feather } from 'lucide-react';

export default function BrandStory() {
  return (
    <section className="py-24 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Visual Product Showcase Stack */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-soft-lg border border-[#EBE3D5] aspect-[4/3] bg-gradient-to-br from-[#EBF3FA] via-[#F4EFE6] to-[#FAF7F2] flex items-center justify-center">
              <img
                src="/assets/bracelets/Bracelets_combo-removebg-preview.png"
                alt="AurelleCharmsss Artisanal Crafting"
                className="w-3/4 h-3/4 object-contain drop-shadow-2xl"
              />
            </div>
            
            {/* Inset Decorative Image Overlay */}
            <div className="absolute -bottom-8 -right-6 w-48 sm:w-60 aspect-square rounded-2xl overflow-hidden shadow-soft-lg border-4 border-white z-20 hidden sm:block bg-gradient-to-br from-[#F4EFE6] via-[#FFFDF9] to-[#EBF3FA] flex items-center justify-center">
              <img
                src="/assets/keychain/Customised_initial_keychain_-removebg-preview.png"
                alt="Initial Keychain Details"
                className="w-3/4 h-3/4 object-contain drop-shadow-lg"
              />
            </div>

            {/* Subtle soft backdrop blur circle */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#D4E4F7]/40 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Story Narrative */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#4A607A] uppercase bg-[#EBF3FA] px-3.5 py-1 rounded-full border border-[#B8D4F0]">
              <Feather className="w-3.5 h-3.5" />
              <span>THE AURELLECHARMSSS PHILOSOPHY</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#2C3E50] font-normal leading-tight">
              MADE BY HAND.<br />
              MADE WITH LOVE.
            </h2>

            <p className="text-base text-[#5C728A] font-light leading-relaxed">
              At <strong className="font-medium text-[#2C3E50]">AurelleCharmsss</strong>, every bracelet, keychain, and phone strap is handcrafted individually with careful attention to detail. We believe that small accessories carry big sentimental charm.
            </p>

            <p className="text-sm text-[#5C728A] font-light leading-relaxed">
              Whether you are treating yourself to a daily charm or creating a customized keepsake gift for someone dear, our pieces are designed using pastel tones, lustrous pearls, and durable hardware built to brighten every day.
            </p>

            {/* Core Values Bullets */}
            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-[#FAF7F2]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[#4A607A]">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-[#2C3E50] uppercase">
                  100% HANDMADE
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-[#2C3E50] uppercase">
                  BESPOKE DETAILS
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
