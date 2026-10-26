import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import type { BannerItem } from '../../data/settingsStore';
import { useTheme } from '../../context/ThemeContext';

interface HeroSliderProps {
  banners: BannerItem[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
  const { language } = useTheme();
  const isBn = language === 'bn';

  const activeBanners = (banners || []).filter((b) => b.isActive).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused]);

  if (!activeBanners || activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-md group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-16/9 sm:aspect-21/8 lg:aspect-3/1 w-full overflow-hidden">
        {activeBanners.map((banner, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Responsive Image with Mobile Fallback */}
              <picture>
                {banner.mobileImageUrl && (
                  <source media="(max-width: 640px)" srcSet={banner.mobileImageUrl} />
                )}
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || banner.title || "Men's Outfit Banner"}
                  className="w-full h-full object-cover object-center brightness-90 group-hover:scale-102 transition-transform duration-700"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              {/* Gradient Overlay & Content */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent flex items-center p-6 sm:p-12 lg:p-16">
                <div className="max-w-xl space-y-3 sm:space-y-4 text-white">
                  {(banner.badgeText || banner.badgeTextBn) && (
                    <span className="inline-block px-3 py-1 bg-[#2563EB] dark:bg-[#C5A880] text-white dark:text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-widest rounded-sm">
                      {isBn ? banner.badgeTextBn || banner.badgeText : banner.badgeText}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase font-heading">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-slate-200 text-xs sm:text-sm sm:max-w-md line-clamp-2 sm:line-clamp-none font-normal">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="pt-2">
                    <Link to={banner.linkUrl || '/shop'}>
                      <Button
                        variant="primary"
                        size="md"
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#C5A880] dark:hover:bg-[#B39366] text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-md px-6 shadow-md cursor-pointer"
                      >
                        <span>{banner.buttonText || (isBn ? 'কালেকশন দেখুন' : 'SHOP NOW')}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Arrows (Visible on multiple banners) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity duration-200 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity duration-200 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-[#2563EB] dark:bg-[#C5A880]'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
