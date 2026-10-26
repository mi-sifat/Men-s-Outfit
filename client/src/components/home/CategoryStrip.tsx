import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Layers, Sparkles, Award } from 'lucide-react';
import type { CategoryItem } from '../../data/categoryStore';
import { useTheme } from '../../context/ThemeContext';

interface CategoryStripProps {
  categories: CategoryItem[];
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'oversized':
      return <Shirt className="w-5 h-5" />;
    case 'drop-shoulder':
      return <Layers className="w-5 h-5" />;
    case 'graphic-tees':
      return <Sparkles className="w-5 h-5" />;
    case 'polo':
      return <Award className="w-5 h-5" />;
    default:
      return <Shirt className="w-5 h-5" />;
  }
};

export const CategoryStrip: React.FC<CategoryStripProps> = ({ categories }) => {
  const { language } = useTheme();
  const isBn = language === 'bn';

  const activeCategories = (categories || []).filter((c) => c.isActive && c.showOnHome).sort((a, b) => a.order - b.order);

  if (activeCategories.length === 0) return null;

  return (
    <div className="w-full">
      {/* Horizontal Strip: Scrollable on mobile, flex/grid in a single row on desktop */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory">
        {activeCategories.map((cat) => {
          const categoryTitle = isBn ? cat.nameBn || cat.name : cat.name;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative flex-none w-[160px] sm:w-auto sm:flex-1 snap-start rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#2563EB]/40 dark:hover:border-[#C5A880]/40 block"
            >
              <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center brightness-85 group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                    {getCategoryIcon(cat.slug)}
                  </div>
                )}
                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3">
                  <div className="w-full">
                    <span className="block text-xs font-bold text-white tracking-wide uppercase truncate">
                      {categoryTitle}
                    </span>
                    <span className="text-[10px] text-slate-300 group-hover:text-amber-400 transition-colors font-mono">
                      {isBn ? 'কালেকশন দেখুন →' : 'Explore →'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
