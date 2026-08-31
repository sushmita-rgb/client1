import React from 'react';
import BrandStory from '../components/home/BrandStory';
import { Heart, Sparkles, Shield, Gift, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      
      {/* Hero Header */}
      <section className="py-16 bg-[#EBF3FA] border-b border-[#D0E2F3] text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase">
            OUR STORY & CRAFT
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C3E50] font-normal">
            ABOUT AURELLECHARMSSS
          </h1>
          <p className="text-base text-[#5C728A] font-light max-w-xl mx-auto leading-relaxed">
            Handcrafted ornaments designed with delicate beads, pastel colors, and sentimental charms.
          </p>
        </div>
      </section>

      {/* Main Brand Story Component */}
      <BrandStory />

      {/* Values Grid */}
      <section className="py-20 bg-[#FFFDF9] border-t border-[#EBE3D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#EBE3D5] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EBF3FA] text-[#4A607A] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E50]">Handmade Precision</h3>
              <p className="text-sm text-[#5C728A] font-light leading-relaxed">
                Every bead is hand-strung and inspected for quality, ensuring every piece you wear is a unique work of art.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#EBE3D5] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EBF3FA] text-[#D4AF37] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E50]">Premium Materials</h3>
              <p className="text-sm text-[#5C728A] font-light leading-relaxed">
                We select non-tarnish 14k gold plated accents, natural freshwater pearls, and durable acrylic charms.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#EBE3D5] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#EBF3FA] text-[#4A607A] flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3E50]">Signature Gifting</h3>
              <p className="text-sm text-[#5C728A] font-light leading-relaxed">
                All products arrive packaged in our signature AurelleCharmsss aesthetic boxes ready for gifting to yourself or loved ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Banner */}
      <section className="py-16 bg-[#EBF3FA] border-t border-[#D0E2F3] text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <Instagram className="w-10 h-10 text-[#4A607A] mx-auto" />
          <h2 className="font-serif text-3xl text-[#2C3E50]">Follow Us On Instagram</h2>
          <p className="text-sm text-[#5C728A] leading-relaxed">
            Visit our Instagram page <strong className="text-[#2C3E50]">@aurellecharmsss</strong> to explore our latest handcrafted drops, behind-the-scenes creation videos, and DM us directly for custom orders!
          </p>
          <a
            href="https://instagram.com/aurellecharmsss"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-semibold tracking-widest uppercase bg-[#4A607A] hover:bg-[#2C3E50] text-white px-8 py-3.5 rounded-full shadow-soft transition-all duration-300 gap-2"
          >
            <Instagram className="w-4 h-4" />
            <span>VISIT INSTAGRAM (@aurellecharmsss)</span>
          </a>
        </div>
      </section>

    </div>
  );
}
