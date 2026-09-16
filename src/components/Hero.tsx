import React from 'react';
import { ArrowDown, Sparkles, MapPin, Instagram, ExternalLink } from 'lucide-react';
import { Language, StoreSettings } from '../types';
import { translations } from '../translations';

interface HeroProps {
  language: Language;
  settings: StoreSettings;
  onScrollToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, settings, onScrollToCatalog }) => {
  const t = translations[language];
  const gis2Url = settings.gis2Url || 'https://2gis.kz/atyrau/geo/70000001094546376';
  const instagramHandle = settings.instagram?.replace('@', '') || 'musliim_shop06';
  const addressDisplay = language === 'ru'
    ? 'пр. Султана Бейбарыса, 45а/5'
    : 'Сұлтан Бейбарыс даңғылы, 45а/5';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#111116] via-[#0D0D12] to-[#0B0B0E] border-b border-[#22222B] pt-8 pb-10 sm:py-16 px-4 sm:px-6">
      {/* Subtle luxury geometric radial background overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#8C6D23]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Boutique location badge with 2GIS and Instagram links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <a
            href={gis2Url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181824]/90 hover:bg-[#202030] border border-[#C5A059]/40 hover:border-[#D4AF37] text-[#D8B467] text-xs sm:text-sm font-medium tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all group"
            title={t.open2Gis}
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>{settings.city}: {addressDisplay}</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#183424] text-[#68D391] text-[10px] font-bold border border-[#276749]/60">
              2ГИС <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>

          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1D1222]/80 hover:bg-[#2A1732] border border-[#97266D]/40 hover:border-[#D53F8C] text-[#F687B3] text-xs sm:text-sm font-medium tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all"
            title="Instagram @musliim_shop06"
          >
            <Instagram className="w-3.5 h-3.5 text-[#ED64A6]" />
            <span>@{instagramHandle}</span>
          </a>
        </div>

        {/* Store Title */}
        <h1 className="font-brand text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.2em] text-[#F5F3EF] mb-3 uppercase drop-shadow-sm">
          {settings.storeName || 'MUSLIM SHOP'}
        </h1>

        {/* Serif Tagline */}
        <div className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#E8D49E] tracking-tight font-medium mb-4 leading-tight">
          {language === 'ru' ? settings.taglineRu : settings.taglineKz}
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl text-[#B3AEA4] text-sm sm:text-base md:text-lg leading-relaxed mb-8 px-2">
          {language === 'ru' ? settings.subtitleRu : settings.subtitleKz}
        </p>

        {/* Call to action button */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onScrollToCatalog}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#DFBF58] to-[#C5A059] hover:from-[#DFBF58] hover:to-[#B68E33] text-[#0B0B0E] font-semibold text-sm sm:text-base tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.viewCatalog}</span>
            <ArrowDown className="w-4 h-4 text-[#0B0B0E]" />
          </button>

          <div className="flex items-center gap-1 text-[12px] text-[#8C877E] sm:hidden">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Натуральные сертифицированные товары</span>
          </div>
        </div>
      </div>
    </section>
  );
};
