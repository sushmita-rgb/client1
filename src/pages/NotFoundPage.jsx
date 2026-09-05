import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Instagram } from 'lucide-react';

// Exponential ease-out. No bounce.
const EASE = [0.16, 1, 0.3, 1];

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  const rise = (delay) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduce ? 0 : delay, duration: reduce ? 0.2 : 0.7, ease: EASE },
  });

  return (
    <section className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center px-6 py-20 sm:py-28">
      <div className="max-w-xl w-full text-center">
        <motion.span
          {...rise(0.05)}
          className="inline-block text-xs font-semibold tracking-widest text-[#4A607A] uppercase bg-[#EBF3FA] px-3.5 py-1 rounded-full border border-[#B8D4F0]"
        >
          Error 404
        </motion.span>

        <motion.h1
          {...rise(0.14)}
          className="mt-6 font-serif font-normal text-[#2C3E50] leading-[1.08] tracking-[-0.02em]
                     text-[clamp(2rem,5vw,3.5rem)] text-balance"
        >
          This page slipped off the chain
        </motion.h1>

        <motion.p
          {...rise(0.26)}
          className="mt-5 mx-auto max-w-[46ch] text-sm sm:text-base font-light leading-relaxed text-[#4A607A] text-pretty"
        >
          We couldn&apos;t find anything at that address. The piece may have sold out, or the link
          may have been mistyped &mdash; try the collection instead.
        </motion.p>

        {/* The attempted path helps when someone reports a dead link. */}
        <motion.p
          {...rise(0.32)}
          className="mt-3 text-xs text-[#7B8794] font-mono break-all"
        >
          {pathname}
        </motion.p>

        <motion.div
          {...rise(0.4)}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/collections"
            className="group inline-flex items-center rounded-full bg-[#4A607A] px-8 py-3.5 text-xs font-semibold
                       uppercase tracking-widest text-white shadow-soft transition-colors duration-300
                       hover:bg-[#2C3E50]"
          >
            Browse the collection
            <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-[#2C3E50]/30 px-8 py-3.5 text-xs
                       font-semibold uppercase tracking-widest text-[#2C3E50] transition-colors duration-300
                       hover:bg-[#2C3E50]/5"
          >
            Back home
          </Link>
        </motion.div>

        <motion.p {...rise(0.5)} className="mt-8 text-xs text-[#4A607A]">
          Looking for something specific?{' '}
          <a
            href="https://instagram.com/aurellecharmsss"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline font-semibold text-[#2C3E50]"
          >
            <Instagram className="w-3.5 h-3.5" /> DM @aurellecharmsss
          </a>
        </motion.p>
      </div>
    </section>
  );
}
