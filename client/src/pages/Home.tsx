import React from 'react';
import Hero from '../components/Hero';
import CollectionGrid from '../components/CollectionGrid';
import FeaturedCollection from '../components/FeaturedCollection';
import WhyNBSection from '../components/WhyNBSection';
import BrandStory from '../components/BrandStory';
import Testimonials from '../components/Testimonials';
import SocialShowcase from '../components/SocialShowcase';
import Newsletter from '../components/Newsletter';
import { usePageMeta } from '../utils/usePageMeta';

export default function Home() {
  usePageMeta('Home', 'NB Classic Scents — premium fragrances crafted to define your presence. Explore Eclipse, Signature, Midnight, and Essence collections.');
  return (
    <>
      <h1 className="sr-only">NB Classic Scents — Premium Fragrances</h1>
      <Hero />
      <CollectionGrid />
      <FeaturedCollection />
      <WhyNBSection />
      <BrandStory />
      <Testimonials />
      <SocialShowcase />
      <Newsletter />
    </>
  );
}
