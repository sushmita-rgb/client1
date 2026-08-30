import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedCollection from '../components/home/FeaturedCollection';
import CategoryGrid from '../components/home/CategoryGrid';
import CustomRequestSection from '../components/home/CustomRequestSection';
import BrandStory from '../components/home/BrandStory';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* SECTION 1 — HERO SLIDESHOW */}
      <HeroSlider />

      {/* SECTION 2 — FEATURED COLLECTION */}
      <FeaturedCollection />

      {/* SECTION 3 — COLLECTION CATEGORIES */}
      <CategoryGrid />

      {/* SECTION 4 — CUSTOMIZED ORDERS */}
      <CustomRequestSection />

      {/* SECTION 5 — BRAND / ABOUT */}
      <BrandStory />
    </div>
  );
}
