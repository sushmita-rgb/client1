import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TESTIMONIALS } from '../../data/testimonials';

/* A wall of pinned notes rather than a card grid: every note is drawn in CSS from
   the brand tokens (pastel blue, cream, gold, ivory) so there are no external
   image assets to break, and the palette stays ours instead of the usual
   highlighter yellow.

   Paper, tilt and tape all key off the note's index, so adding an entry to
   data/testimonials.js is the only step needed to hang a new one on the wall.
   Deterministic, not random — random would re-shuffle on every re-render. */

// Every paper has to hold its own against the #FAF7F2 section ground — ivory
// sat too close to it and read as a floating shadow rather than a note.
const PAPERS = ['#EBF3FA', '#F4EFE6', '#FDF8E7', '#F2ECE4'];
const TAPES = ['rgba(184,212,240,0.8)', 'rgba(212,175,55,0.32)', 'rgba(222,211,193,0.85)'];
const TILTS = [-2.5, 3, -1.5, 2, -3, 1.5];
const TAPE_X = ['22%', '50%', '74%'];

// Faint fibre, so the notes read as paper without loading a texture image.
const PAPER_GRAIN =
  'repeating-linear-gradient(0deg, rgba(44,62,80,0.014) 0 1px, transparent 1px 3px)';

// Exponential ease-out. No bounce.
const EASE = [0.16, 1, 0.3, 1];

export default function Testimonials() {
  const reduce = useReducedMotion();
  // A half-written entry shouldn't hang a blank note on the wall.
  const notes = TESTIMONIALS.filter((t) => t?.quote?.trim() && t?.name?.trim());
  if (!notes.length) return null;

  return (
    <section className="py-20 sm:py-24 bg-[#FAF7F2] border-y border-[#EBE3D5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold tracking-widest text-[#4A607A] uppercase">
            KIND WORDS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C3E50] font-normal text-balance">
            WHAT CUSTOMERS SAY
          </h2>
          <p className="text-base text-[#4A607A] font-light text-pretty">
            Notes from the people who wear our pieces every day.
          </p>
        </div>

        {/* Grid, not CSS columns: the tape sits outside the note's own box, and
            in a multi-column container those absolutely-positioned strips leak
            out as orphan fragments at the foot of each column. */}
        <ul className="grid gap-7 sm:gap-8 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] items-start list-none">
          {notes.map((t, i) => {
            const tilt = TILTS[i % TILTS.length];
            const motionProps = reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.92, rotate: 0 },
                  whileInView: { opacity: 1, scale: 1, rotate: tilt },
                  viewport: { once: true, amount: 0.2 },
                  transition: { duration: 0.6, delay: (i % 4) * 0.08, ease: EASE },
                  whileHover: { rotate: 0, scale: 1.04 },
                };

            return (
              <motion.li
                key={`${t.name}-${i}`}
                {...motionProps}
                style={{
                  backgroundColor: PAPERS[i % PAPERS.length],
                  backgroundImage: PAPER_GRAIN,
                  // Framer owns the transform while animating; this is the
                  // resting tilt for the reduced-motion path.
                  ...(reduce ? { transform: `rotate(${tilt}deg)` } : null),
                  boxShadow:
                    '0 0 0 1px rgba(92,114,138,0.07), 0 1px 1px rgba(92,114,138,0.10), 0 10px 22px -10px rgba(92,114,138,0.35)',
                }}
                className="relative min-h-[13.5rem] rounded-[3px] px-7 py-9 flex flex-col justify-between gap-5"
              >
                {/* Washi tape, offset per note so the wall doesn't look stamped. */}
                <span
                  aria-hidden="true"
                  style={{
                    backgroundColor: TAPES[i % TAPES.length],
                    left: TAPE_X[i % TAPE_X.length],
                    transform: `translateX(-50%) rotate(${tilt * -1.6}deg)`,
                  }}
                  className="absolute -top-2.5 z-10 h-6 w-20 rounded-[1px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
                />

                {/* whitespace-pre-line keeps the line breaks of a pasted review. */}
                <blockquote className="font-serif text-[1.0625rem] leading-snug text-[#2C3E50] text-pretty whitespace-pre-line">
                  <span aria-hidden="true">&ldquo;</span>
                  {t.quote}
                  <span aria-hidden="true">&rdquo;</span>
                </blockquote>

                <figcaption className="not-italic">
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-[#4A607A]">
                    {t.name}
                  </span>
                  {t.location && (
                    <span className="block mt-1 text-[11px] text-[#5C728A] font-light">
                      {t.location}
                    </span>
                  )}
                </figcaption>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
