import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* Art-directed to /hero/heroImage.png (cool teal landscape, warm gold jewellery)
   rather than to the cream page shell. Colours are sampled from the photograph;
   contrast is measured against the pale mist inside its safe zone — #073B4C ink
   7.6:1, #285563 support 5.2:1. Gold (#C99A3D) only ever appears as a background
   under dark teal; as text on the mist it lands at 1.6:1.

   The photograph is a fixed 16:9 composition: keychains framing both corners, a
   clean centre column at x 35–65%. Cropping it to a portrait viewport throws the
   jewellery away, so below `sm` the image keeps its full aspect and the copy
   drops beneath it instead of overlaying. */

// Exponential ease-out. No bounce.
const EASE = [0.16, 1, 0.3, 1];

export default function HeroSlider() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  // One orchestrated page-load: everything rises out of the mist, staggered.
  const rise = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduce ? 0 : delay, duration: reduce ? 0.2 : 0.85, ease: EASE },
  });

  return (
    <section className="relative w-full bg-[#FAF7F2] lg:aspect-[16/9] lg:max-h-[860px]">
      {/* The photograph IS the design — no panel, no wash across the centre.
          scale 1.02 crops the encoder fringing on the source file's edges. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#8FD8EE] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        <motion.img
          src="/hero/heroImage.png"
          alt="Two handmade black-and-gold anime charm keychains hanging over a misty mountain valley"
          fetchPriority="high"
          decoding="async"
          initial={{ scale: reduce ? 1.02 : 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: reduce ? 0 : 6, ease: EASE }}
          className="h-full w-full object-cover object-center"
        />
        {/* The scene's own haze, thickened just enough to carry body copy over the
            mountain ridges that reach into the safe zone. Not a panel: it is fully
            transparent long before either keychain, and only exists in overlay mode. */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              'radial-gradient(ellipse 42% 46% at 50% 47%, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0.38) 55%, rgba(255,255,255,0) 100%)',
          }}
        />
        {/* Settles the grass edge into the cream page below. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#FAF7F2] lg:h-24" />
      </div>

      {/* Desktop: centred in the image's own safe zone, slightly above the middle,
          never overlapping either keychain. Mobile: directly beneath it. */}
      <div className="relative z-10 flex flex-col items-center px-6 pb-10 pt-10 text-center lg:h-full lg:justify-center lg:pb-[7%] lg:pt-0">
        <motion.h1
          {...rise(0.15)}
          className="max-w-[15ch] text-balance lg:max-w-[36%] font-serif font-normal leading-[1.04] tracking-[-0.02em]
                     text-[clamp(2.25rem,6.2vw,5.25rem)] text-[#073B4C]
                     lg:[text-shadow:0_1px_3px_rgba(7,59,76,0.16)]"
        >
          Wear the <em className="italic">worlds</em> you love
        </motion.h1>

        <motion.p
          {...rise(0.3)}
          className="mt-5 max-w-[40ch] text-pretty lg:max-w-[34%] text-sm font-light leading-relaxed text-[#0B4652]
                     lg:mt-6 lg:text-base lg:[text-shadow:0_1px_3px_rgba(7,59,76,0.14)]"
        >
          Handmade bracelets, keychains and phone charms — beaded one at a time,
          for the characters and colours you carry everywhere.
        </motion.p>

        <motion.div {...rise(0.45)} className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:mt-9 lg:gap-4">
          <button
            onClick={() => navigate('/collections')}
            className="group inline-flex items-center rounded-full bg-[#084C5A] px-8 py-3.5 text-xs font-semibold
                       uppercase tracking-widest text-[#FFF8E7] shadow-soft transition-colors duration-300
                       hover:bg-[#C99A3D] hover:text-[#073B4C]"
          >
            Explore the collection
            <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>

          <a
            href="#custom-orders"
            className="inline-flex items-center rounded-full border border-[#073B4C]/40 px-8 py-3.5 text-xs
                       font-semibold uppercase tracking-widest text-[#073B4C] transition-colors duration-300
                       hover:bg-[#073B4C]/10"
          >
            Custom orders
          </a>
        </motion.div>
      </div>

      {/* A full-bleed hero hides the fold. Mobile doesn't need telling. */}
      <motion.a
        href="#featured"
        aria-label="Scroll to the collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.1, duration: 0.6, ease: EASE }}
        className="absolute inset-x-0 bottom-5 z-10 mx-auto hidden w-max items-center justify-center
                   text-[#073B4C] opacity-70 transition-opacity hover:opacity-100 lg:flex"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
        </motion.span>
      </motion.a>
    </section>
  );
}
