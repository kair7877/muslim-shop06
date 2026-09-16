import React from 'react';
import { X, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Category, Language, SortOption } from '../types';
import { translations } from '../translations';

interface SearchAndFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  onlyInStock: boolean;
  onToggleInStock: (v: boolean) => void;
  onlySale: boolean;
  onToggleSale: (v: boolean) => void;
  onReset: () => void;
}

export const SearchAndFilterModal: React.FC<SearchAndFilterModalProps> = ({
  isOpen,
  onClose,
  categories,
  language,
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  onSelectCategory,
  sortBy,
  onSortChange,
  onlyInStock,
  onToggleInStock,
  onlySale,
  onToggleSale,
  onReset,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-lg bg-[#121218] border-t sm:border border-[#282838] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#20202C] mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif text-lg font-bold text-[#F4F1EA]">
              {t.filters} & {t.search}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#1A1A24] text-[#A6A29A] hover:text-[#F4F1EA]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-5 flex-1 pr-1">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-1.5">
              {t.search}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C877D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#171722] border border-[#2A2A38] text-sm text-[#F4F1EA] placeholder-[#6E6A62] outline-none focus:border-[#D4AF37] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C877D] hover:text-[#F4F1EA]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
              {t.sortBy}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'popular', label: t.sortPopular },
                { id: 'newest', label: t.sortNewest },
                { id: 'price_asc', label: t.sortPriceAsc },
                { id: 'price_desc', label: t.sortPriceDesc },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSortChange(opt.id as SortOption)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-[#20202E] border-[#D4AF37] text-[#D4AF37] font-semibold'
                      : 'bg-[#15151F] border-[#242432] text-[#A6A29A] hover:border-[#38384A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-2">
              {t.category}
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedCategoryId === null
                    ? 'bg-[#C5A059] text-[#0B0B0E] font-bold border-[#C5A059]'
                    : 'bg-[#15151F] text-[#A6A29A] border-[#242432]'
                }`}
              >
                {t.allProducts}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    selectedCategoryId === c.id
                      ? 'bg-[#C5A059] text-[#0B0B0E] font-bold border-[#C5A059]'
                      : 'bg-[#15151F] text-[#A6A29A] border-[#242432]'
                  }`}
                >
                  {c.icon} {language === 'ru' ? c.nameRu : (c.nameKz || c.nameRu)}
                </button>
              ))}
            </div>
          </div>

          {/* Availability & Discounts Switches */}
          <div className="p-3.5 bg-[#161622] rounded-2xl border border-[#242434] space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-[#E6E2D8] font-medium">
                {t.filterOnlyInStock}
              </span>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => onToggleInStock(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-[#E6E2D8] font-medium">
                {t.filterOnlySale}
              </span>
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => onToggleSale(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#20202C] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-[#181824] hover:bg-[#202030] text-xs text-[#A6A29A] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0E] font-bold text-xs sm:text-sm cursor-pointer shadow-md transition-colors"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};
