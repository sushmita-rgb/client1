import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categoryConfig = [
  {
    title: 'BRACELETS',
    subtitle: 'Handmade bracelets designed with delicate beads and charms.',
    image: '/assets/bracelets/Bracelets_combo-removebg-preview.png',
    bg: 'from-[#EBF3FA] via-[#F4EFE6] to-[#FFFDF9]',
    category: 'Bracelets',
  },
  {
    title: 'KEYCHAINS',
    subtitle: 'Cute handmade keychains for bags, keys and gifting.',
    image: '/assets/keychain/Customised_initial_keychain___2_-removebg-preview.png',
    bg: 'from-[#F4EFE6] via-[#FFFDF9] to-[#EBF3FA]',
    category: 'Keychains',
  },
  {
    title: 'MOBILE KEYCHAINS',
    subtitle: 'Small personalized charms for your everyday devices.',
    image: '/assets/mobile/Phone_charms_combo-removebg-preview.png',
    bg: 'from-[#EBF3FA] via-[#FFFDF9] to-[#F0EBF8]',
    category: 'Mobile Keychains',
  },
];

export default function CategoryGrid() {
  const categoryBlocks = categoryConfig;

  return (
    <section className="py-20 bg-[#FFFDF9] border-y border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase">
            EXPLORE BY CATEGORY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C3E50] font-normal">
            OUR ESSENTIAL CATEGORIES
          </h2>
        </div>

        {/* 3 Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoryBlocks.map((block) => (
            <div
              key={block.title}
              className="group relative flex flex-col bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EBE3D5] hover:border-[#B8D4F0] transition-all duration-300 shadow-soft-sm hover:shadow-soft"
            >
              {/* Image Container — themed gradient bg for transparent PNGs */}
              <div className={`relative h-64 sm:h-72 w-full overflow-hidden bg-gradient-to-br ${block.bg} flex items-center justify-center`}>
                <img
                  src={block.image}
                  alt={block.title}
                  className="w-2/3 h-full object-contain object-center drop-shadow-xl group-hover:scale-110 transition-transform duration-700 ease-out py-6"
                />
                {/* subtle bottom darkening overlay for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#2C3E50]/10 to-transparent pointer-events-none" />
              </div>


              {/* Text Content */}
              <div className="p-8 flex flex-col justify-between flex-grow">
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl text-[#2C3E50] tracking-wide">
                    {block.title}
                  </h3>
                  <p className="text-sm text-[#5C728A] leading-relaxed">
                    {block.subtitle}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    to={`/collections?category=${encodeURIComponent(block.category)}`}
                    className="inline-flex items-center text-xs font-semibold tracking-widest text-[#4A607A] group-hover:text-[#2C3E50] uppercase"
                  >
                    <span>EXPLORE</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
