import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      category: 'Bracelets',
      headline: 'UNMATCHED BEAUTY',
      subtitle: 'Handmade with love, designed to shine. Bracelets, keychains & more — just for you.',
      ctaText: 'EXPLORE COLLECTION',
      link: '/collections?category=Bracelets',
      // Woman's wrist with stacked beaded bracelets, soft blue bg — matches reference
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&auto=format&fit=crop&q=85',
    },
    {
      id: 2,
      category: 'Keychains',
      headline: 'LITTLE THINGS, BIG CHARM',
      subtitle: 'Handcrafted keychains full of colour, love and personality.',
      ctaText: 'SHOP KEYCHAINS',
      link: '/collections?category=Keychains',
      // Colourful beads and jewellery accessories on soft cream surface
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&auto=format&fit=crop&q=85',
    },
    {
      id: 3,
      category: 'Mobile Keychains',
      headline: 'CHARM YOUR EVERYDAY',
      subtitle: 'Personalised phone charms handmade for the things you carry closest.',
      ctaText: 'DISCOVER MORE',
      link: '/collections?category=Mobile%20Keychains',
      // Hand holding phone with charm / jewelry accessories, soft aesthetic
      image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=1200&auto=format&fit=crop&q=85',
    },
  ];


  // Auto-advance every 3 seconds (fast-ish like 1 s visible transition)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative w-full h-[75vh] sm:h-[82vh] min-h-[480px] sm:min-h-[580px] max-h-[850px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Full-width background image */}
          <motion.img
            key={slides[currentSlide].image}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].headline}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Left-side soft blue/cream overlay — matches the reference watercolor wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D6E8F5]/92 via-[#EBF3FA]/75 sm:via-[#EBF3FA]/60 to-transparent" />
          {/* Very subtle top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/20 pointer-events-none" />

          {/* Decorative star sparkle elements like the reference */}
          <div className="absolute top-16 left-[38%] text-[#B8D4F0] text-2xl opacity-60 pointer-events-none select-none hidden sm:block">✦</div>
          <div className="absolute top-28 left-[42%] text-[#B8D4F0] text-sm opacity-40 pointer-events-none select-none hidden sm:block">✦</div>
          <div className="absolute bottom-24 left-[36%] text-[#B8D4F0] text-lg opacity-40 pointer-events-none select-none hidden sm:block">✦</div>

          {/* Text content — left side overlaid on the gradient */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-14 lg:px-20 max-w-xl">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#4A7FA5] uppercase mb-3 sm:mb-5"
            >
              AURELLECHARMSSS HANDMADE COLLECTION
            </motion.span>

            <motion.h1
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#2C4A6E] leading-[1.1] sm:leading-[1.05] font-normal tracking-wide mb-2"
            >
              {slides[currentSlide].headline}
            </motion.h1>

            {/* Heart divider like the reference */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-3 my-4"
            >
              <div className="h-[1px] w-10 bg-[#B8D4F0]" />
              <span className="text-[#B8D4F0] text-base">♡</span>
              <div className="h-[1px] w-10 bg-[#B8D4F0]" />
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              className="text-sm sm:text-base text-[#4A607A] font-light leading-relaxed mb-8 max-w-sm"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={() => navigate(slides[currentSlide].link)}
                className="group inline-flex items-center text-xs tracking-widest uppercase font-semibold text-white bg-[#4A7FA5] hover:bg-[#3A6A8E] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>{slides[currentSlide].ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Counter + Controls */}
      <div className="absolute bottom-8 left-8 sm:left-12 lg:left-20 z-20 flex items-center space-x-6">
        <span className="font-serif text-sm tracking-widest text-[#4A607A] font-semibold">
          0{currentSlide + 1} <span className="text-[#94A3B8] font-sans text-xs">/ 0{slides.length}</span>
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#5C728A] hover:text-[#2C3E50] hover:bg-white border border-[#EBE3D5] transition-colors shadow-soft-sm"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#5C728A] hover:text-[#2C3E50] hover:bg-white border border-[#EBE3D5] transition-colors shadow-soft-sm"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-9 right-8 sm:right-12 z-20 flex items-center space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentSlide
                ? 'w-6 h-2 bg-[#4A607A]'
                : 'w-2 h-2 bg-[#B8D4F0] hover:bg-[#4A607A]/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
