import React from 'react';
import { ShoppingBag, Search, ShieldCheck, Clock, MapPin, Instagram, ExternalLink } from 'lucide-react';
import { Language, StoreSettings } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  language: Language;
  settings?: StoreSettings;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenPrayerTimes: () => void;
  onLogoClick: () => void;
  storeName: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  settings,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onOpenPrayerTimes,
  onLogoClick,
  storeName,
}) => {
  const t = translations[language];
  const gis2Url = settings?.gis2Url || 'https://2gis.kz/atyrau/geo/70000001094546376';
  const instagramHandle = settings?.instagram?.replace('@', '') || 'musliim_shop06';
  const instagramUrl = `https://instagram.com/${instagramHandle}`;
  const addressDisplay = language === 'ru' 
    ? 'пр. Султана Бейбарыса, 45а/5' 
    : 'Сұлтан Бейбарыс даңғылы, 45а/5';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0E]/95 backdrop-blur-md border-b border-[#24242C] transition-all">
      {/* Top Luxury Prestige Micro-Bar: 2GIS, Address, Instagram, Prayer times */}
      <div className="bg-[#101016] text-[#A6A29A] text-[11px] py-1.5 px-3 sm:px-6 border-b border-[#1E1E28]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3">
          
          {/* Left: Address + 2GIS Interactive Luxury Link */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px]">
            <a
              href={gis2Url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-[#C4BFB5] hover:text-[#D4AF37] transition-colors"
              title={language === 'ru' ? 'Посмотреть адрес в 2ГИС' : 'Мекенжайды 2ГИС-тен көру'}
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="hidden sm:inline text-[#7E796F]">{language === 'ru' ? 'Атырау:' : 'Атырау:'}</span>
              <span className="font-medium underline decoration-[#4A453C] underline-offset-2 group-hover:decoration-[#D4AF37]">
                {addressDisplay}
              </span>
            </a>

            {/* Direct 2GIS Gold-Emerald Badge Button */}
            <a
              href={gis2Url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#173022] to-[#12241A] hover:from-[#214732] hover:to-[#193626] border border-[#2B734C]/70 hover:border-[#48BB78] text-[#68D391] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all shadow-[0_2px_8px_rgba(43,115,76,0.25)] hover:shadow-[0_2px_12px_rgba(72,187,120,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
              title={t.open2Gis}
            >
              <span>2ГИС</span>
              <ExternalLink className="w-2.5 h-2.5 text-[#68D391]" />
            </a>
          </div>

          {/* Right: Instagram + Prayer Times + Admin */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Direct Instagram Luxury Rose-Gold Badge */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#291428] via-[#201024] to-[#160E1D] hover:from-[#3D1A3B] hover:to-[#2B142F] border border-[#A83279]/50 hover:border-[#E879F9] text-[#F472B6] hover:text-[#FDF2F8] text-[10px] sm:text-[11px] font-medium transition-all shadow-[0_2px_8px_rgba(168,50,121,0.2)] hover:scale-105 active:scale-95 cursor-pointer"
              title="Instagram @musliim_shop06"
            >
              <Instagram className="w-3.5 h-3.5 text-[#F472B6] flex-shrink-0" />
              <span className="font-semibold tracking-wide">@{instagramHandle}</span>
            </a>

            {/* Prayer Times Shortcut */}
            <button
              onClick={onOpenPrayerTimes}
              className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#18261E] hover:bg-[#20362A] border border-[#276749]/60 text-[#68D391] text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer shadow-sm"
              title={t.prayerTimes}
            >
              <span>🕌</span>
              <span className="hidden sm:inline">{t.prayerTimes}</span>
            </button>

            {/* Admin trigger */}
            <button
              onClick={onOpenAdmin}
              className="text-[#7E7A72] hover:text-[#C5A059] transition-colors flex items-center gap-1 text-[11px] p-0.5"
              title={t.navProfile}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Store Logo & Subtitle */}
        <button
          onClick={onLogoClick}
          className="text-left group flex items-center gap-2.5 focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#8C6D23] p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <div className="w-full h-full bg-[#0B0B0E] rounded-[10px] flex items-center justify-center text-[#D4AF37] font-bold text-sm sm:text-base font-serif">
              M
            </div>
          </div>
          <div>
            <span className="font-brand font-bold text-base sm:text-xl tracking-[0.18em] text-[#F4F1EA] group-hover:text-[#D4AF37] transition-colors block leading-tight">
              {storeName || 'MUSLIM SHOP'}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#8C877D] block leading-none mt-0.5">
              ATYRAU · BOUTIQUE
            </span>
          </div>
        </button>

        {/* Center: Quick navigation links for Desktop (2GIS & Instagram showcase) */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={gis2Url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14141E] hover:bg-[#1C1C2C] border border-[#282838] hover:border-[#48BB78]/60 text-xs text-[#C5C0B4] hover:text-[#68D391] transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[#48BB78]" />
            <span className="text-[#8A857A]">2ГИС:</span>
            <span className="font-medium text-[#E0DCD3]">{addressDisplay}</span>
            <ExternalLink className="w-3 h-3 text-[#48BB78]" />
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17121C] hover:bg-[#231A2B] border border-[#2D2136] hover:border-[#ED64A6]/60 text-xs text-[#F472B6] transition-all"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span className="font-medium">@{instagramHandle}</span>
          </a>
        </div>

        {/* Right action controls: Prayer, Language Switch, Search, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Prayer Times Button (Visible on md+) */}
          <button
            onClick={onOpenPrayerTimes}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#E8D49E] hover:text-[#D4AF37] bg-[#161622] hover:bg-[#202030] border border-[#C5A059]/30 text-xs font-medium transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.prayerTimes}</span>
          </button>

          {/* RU / KZ Language Toggle */}
          <div className="flex items-center bg-[#181820] border border-[#2A2A35] rounded-full p-0.5 text-xs font-medium">
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                language === 'ru'
                  ? 'bg-[#C5A059] text-[#0B0B0E] font-bold shadow-sm'
                  : 'text-[#9A968E] hover:text-[#F4F1EA]'
              }`}
            >
              RU
            </button>
            <button
              onClick={() => onLanguageChange('kz')}
              className={`px-2 sm:px-2.5 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                language === 'kz'
                  ? 'bg-[#C5A059] text-[#0B0B0E] font-bold shadow-sm'
                  : 'text-[#9A968E] hover:text-[#F4F1EA]'
              }`}
            >
              KZ
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-[#A8A49C] hover:text-[#D4AF37] hover:bg-[#181820] border border-transparent hover:border-[#2A2A35] transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label={t.search}
          >
            <Search className="w-5 h-5" />
            <span className="hidden md:inline text-xs">{t.search}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:px-3.5 sm:py-1.5 rounded-full bg-[#181820] hover:bg-[#20202A] text-[#F4F1EA] border border-[#2E2E3C] hover:border-[#C5A059]/40 transition-all flex items-center gap-2 cursor-pointer"
            aria-label={t.cart}
          >
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <span className="hidden sm:inline text-xs font-medium">{t.cart}</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-[#0B0B0E] bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
