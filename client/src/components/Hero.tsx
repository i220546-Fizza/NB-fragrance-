import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HERO_SLIDES } from '../data/heroSlides';
import { heroSlideService, type HeroSlideOverride } from '../services/heroSlideService';

const AUTO_ADVANCE_MS = 6000;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function Particles({ color, count = 12 }: { color: string; count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: 5 + Math.random() * 90,
        top: 8 + Math.random() * 80,
        size: 3 + Math.random() * 7,
        duration: 5 + Math.random() * 6,
        delay: Math.random() * 4,
        drift: Math.random() > 0.5 ? 'animate-float1' : 'animate-float2',
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute rounded-full blur-[1px] ${p.drift}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [overrides, setOverrides] = useState<Record<string, HeroSlideOverride>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    heroSlideService
      .getAll()
      .then(setOverrides)
      .catch(() => {
        /* keep the bundled defaults if this fails */
      });
  }, []);

  // An admin-uploaded photo replaces the slide's default artwork and is
  // always shown with the real-photography treatment (framed panel + Ken
  // Burns zoom) rather than the illustrated bottle/pedestal/ribbon composite.
  // The description text can be overridden independently of the photo.
  const slides = useMemo(
    () =>
      HERO_SLIDES.map((s) => {
        const override = overrides[s.key];
        if (!override) return s;
        return {
          ...s,
          bottle: override.image || s.bottle,
          headline: override.headline || s.headline,
          description: override.description || s.description,
          photo: override.image ? true : s.photo,
        };
      }),
    [overrides]
  );

  const slide = slides[index];

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, slides.length]);

  const goTo = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || isTouch || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: px * 10, y: py * -8 });
    },
    [reducedMotion, isTouch]
  );

  const heading = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setTilt({ x: 0, y: 0 });
      }}
      className="relative min-h-[92vh] w-full overflow-hidden bg-offwhite flex items-center pt-16 md:pt-20"
      aria-roledescription="carousel"
      aria-label="NB Classic Scents featured collections"
    >
      {/* ambient spotlight */}
      <motion.div
        key={`glow-${slide.key}`}
        className="absolute right-[6%] top-1/2 -translate-y-1/2 h-[70%] w-[55%] rounded-full blur-[100px] pointer-events-none"
        style={{ background: slide.glow }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* oversized editorial wordmark, bleeding behind the product */}
      <motion.div
        key={`word-${slide.key}`}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center lg:justify-end pointer-events-none select-none z-[1]"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-display font-normal leading-none tracking-tight text-cocoa/[0.09] text-[34vw] sm:text-[24vw] lg:text-[17rem] lg:mr-[4%] whitespace-nowrap">
          NB
        </span>
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
        {/* copy */}
        <motion.div
          key={`copy-${slide.key}`}
          variants={heading}
          initial="hidden"
          animate="show"
          className="order-2 lg:order-1 text-center lg:text-left"
        >
          <motion.span
            variants={item}
            className="block mb-5 font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.04em] text-champagne"
          >
            NB <span className="text-soft-gold">Classic Scents</span>
          </motion.span>
          <motion.h1 variants={item} className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-cocoa">
            {slide.headline}
          </motion.h1>
          <motion.p variants={item} className="mt-5 text-cocoa/70 text-base sm:text-lg max-w-md mx-auto lg:mx-0 font-script text-xl">
            {slide.tagline}
          </motion.p>
          <motion.p variants={item} className="mt-3 text-cocoa/55 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
            {slide.description}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link to="/shop" className="btn-primary w-full sm:w-auto">
              {slide.ctaPrimary}
            </Link>
            <Link to="/scent-finder" className="btn-outline-dark w-full sm:w-auto">
              {slide.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>

        {/* visual */}
        <div className="order-1 lg:order-2 relative h-[360px] sm:h-[460px] lg:h-[600px] flex items-end justify-center pb-4 sm:pb-8">
          <AnimatePresence mode="wait">
            {slide.photo ? (
              <motion.div
                key={slide.key}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="absolute inset-[6%] sm:inset-[8%] rounded-sm blur-[90px] opacity-70"
                  style={{ background: slide.glow }}
                />
                <Particles color={slide.particleColor} count={reducedMotion ? 0 : isTouch ? 6 : 10} />
                <motion.div
                  className="relative w-[82%] sm:w-[72%] lg:w-[68%] aspect-[4/5] rounded-sm overflow-hidden border border-champagne/25 shadow-[0_40px_90px_rgba(63,51,42,0.25)]"
                  style={{
                    transform: `perspective(1400px) rotateY(${tilt.x * 0.6}deg) rotateX(${tilt.y * 0.5}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.img
                    src={slide.bottle}
                    alt="NB Classic Scents Zafora eau de parfum bottle styled on natural stone with white blossom branches"
                    className="h-full w-full object-cover"
                    initial={{ scale: 1.08 }}
                    animate={reducedMotion ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ duration: 9, ease: 'easeOut' }}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-champagne/20 pointer-events-none" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={slide.key}
                className="absolute inset-0 flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* ribbon / liquid splash, flowing from the bottle's neck */}
                <motion.img
                  src={index % 2 === 0 ? '/images/liquid-splash-1.svg' : '/images/liquid-splash-2.svg'}
                  alt=""
                  aria-hidden="true"
                  className="absolute w-[150%] max-w-none sm:w-[130%] lg:w-[135%] top-[2%] sm:top-0 opacity-90 animate-drift"
                  style={{ filter: slide.splashFilter }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.9, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* rose-gold pedestal the bottle rests on */}
                <motion.img
                  src="/images/hero-pedestal.svg"
                  alt=""
                  aria-hidden="true"
                  className="absolute bottom-0 w-[78%] sm:w-[64%] lg:w-[58%]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />

                <Particles color={slide.particleColor} count={reducedMotion ? 0 : isTouch ? 7 : 12} />

                {/* bottle */}
                <motion.img
                  src={slide.bottle}
                  alt={`NB Classic Scents ${slide.collection} collection perfume bottle`}
                  className="relative z-10 h-[78%] sm:h-[82%] w-auto mb-[6%] sm:mb-[7%] drop-shadow-[0_30px_60px_rgba(63,51,42,0.35)]"
                  style={{
                    transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                    filter: `drop-shadow(0 0 45px ${slide.glow})`,
                  }}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* pagination */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          aria-label="Previous slide"
          onClick={() => goTo(index - 1)}
          className="text-cocoa/40 hover:text-champagne transition-colors hidden sm:block"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={s.key}
              aria-label={`Show ${s.collection} collection slide`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? 28 : 8,
                backgroundColor: i === index ? '#B89A6A' : 'rgba(63,51,42,0.22)',
              }}
            />
          ))}
        </div>
        <button
          aria-label="Next slide"
          onClick={() => goTo(index + 1)}
          className="text-cocoa/40 hover:text-champagne transition-colors hidden sm:block"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
