import React, { useRef } from 'react';
import { Category, Language } from '../types';
import { translations } from '../translations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  language: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  language,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-4 sm:py-6 border-b border-[#1E1E26] bg-[#0E0E13]/60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#C5A059] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            {t.categories}
          </h2>

          {/* Desktop scroll buttons */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-full bg-[#181822] hover:bg-[#222230] text-[#A6A29A] hover:text-[#D4AF37] border border-[#272734] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-full bg-[#181822] hover:bg-[#222230] text-[#A6A29A] hover:text-[#D4AF37] border border-[#272734] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable categories container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {/* "All" button */}
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
              selectedCategoryId === null
                ? 'bg-[#C5A059] text-[#0B0B0E] font-bold border-[#C5A059] shadow-[0_2px_12px_rgba(197,160,89,0.3)]'
                : 'bg-[#14141B] text-[#B8B4AA] hover:text-[#F4F1EA] border-[#22222E] hover:border-[#C5A059]/40'
            }`}
          >
            <span>💎</span>
            <span>{t.allProducts}</span>
          </button>

          {/* Dynamic categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const name = language === 'ru' ? cat.nameRu : (cat.nameKz || cat.nameRu);

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#C5A059] text-[#0B0B0E] font-bold border-[#C5A059] shadow-[0_2px_12px_rgba(197,160,89,0.3)]'
                    : 'bg-[#14141B] text-[#B8B4AA] hover:text-[#F4F1EA] border-[#22222E] hover:border-[#C5A059]/40'
                }`}
              >
                <span className="text-sm">{cat.icon || '🌿'}</span>
                <span className="whitespace-nowrap">{name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
