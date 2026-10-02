export interface HeroSlideData {
  key: string;
  collection: string;
  headline: string;
  tagline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Default bundled artwork, used unless an admin has uploaded a replacement. */
  bottle: string;
  glow: string;
  particleColor: string;
  splashFilter: string;
  /** Real campaign photography instead of the illustrated bottle + pedestal composite. */
  photo?: boolean;
}

export const HERO_SLIDES: HeroSlideData[] = [
  {
    key: 'zafora',
    collection: 'Zafora',
    headline: 'Zafora',
    tagline: 'Crafted for the Senses.',
    description:
      'A sophisticated fragrance that captures warmth, light and quiet confidence in every note — composed for those who leave a lasting impression.',
    ctaPrimary: 'Explore Zafora',
    ctaSecondary: 'Shop Collection',
    bottle: '/images/hero-zafora.webp',
    glow: 'rgba(184,154,106,0.35)',
    particleColor: '#B89A6A',
    splashFilter: 'none',
    photo: true,
  },
  {
    key: 'eclipse',
    collection: 'Eclipse',
    headline: 'Eclipsed in Mystery, Radiant in Presence.',
    tagline: 'Unveil the essence of mystery and radiance.',
    description: 'Deep, warm and unmistakably bold — the Eclipse collection for those who command a room.',
    ctaPrimary: 'Explore Collection',
    ctaSecondary: 'Discover Your Scent',
    bottle: '/images/hero-bottle-eclipse.svg',
    glow: 'rgba(184,154,106,0.4)',
    particleColor: '#B89A6A',
    splashFilter: 'none',
  },
  {
    key: 'signature',
    collection: 'Signature',
    headline: 'A Signature Scent. A Lasting Impression.',
    tagline: 'Your scent. Your identity.',
    description: 'Elegant, timeless and entirely yours — a fragrance composed to become your signature.',
    ctaPrimary: 'Explore Collection',
    ctaSecondary: 'Discover Your Scent',
    bottle: '/images/hero-bottle-signature.svg',
    glow: 'rgba(184,154,106,0.45)',
    particleColor: '#B89A6A',
    splashFilter: 'none',
  },
  {
    key: 'midnight',
    collection: 'Midnight',
    headline: 'Made for Unforgettable Nights.',
    tagline: 'Made for unforgettable nights.',
    description: 'Sensual and enveloping — the Midnight collection lingers long after the night ends.',
    ctaPrimary: 'Explore Collection',
    ctaSecondary: 'Discover Your Scent',
    bottle: '/images/hero-bottle-midnight.svg',
    glow: 'rgba(107,85,67,0.35)',
    particleColor: '#6B5543',
    splashFilter: 'hue-rotate(140deg) saturate(1.1)',
  },
  {
    key: 'essence',
    collection: 'Essence',
    headline: 'Discover Your Signature.',
    tagline: 'Discover your signature.',
    description: 'Pure, understated and quietly confident — a fragrance for those who favor discovery over declaration.',
    ctaPrimary: 'Explore Collection',
    ctaSecondary: 'Discover Your Scent',
    bottle: '/images/hero-bottle-essence.svg',
    glow: 'rgba(176,152,120,0.45)',
    particleColor: '#B09878',
    splashFilter: 'hue-rotate(320deg) saturate(1.1)',
  },
];
