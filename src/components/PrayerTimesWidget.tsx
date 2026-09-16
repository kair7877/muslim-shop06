import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronDown, Sparkles, Moon, Sun, Sunrise, Sunset, Compass, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  calculatePrayerTimes,
  KAZAKHSTAN_CITIES,
  CityLocation,
  DailyPrayerInfo,
} from '../utils/prayerTimes';

interface PrayerTimesWidgetProps {
  language: Language;
  onClose?: () => void;
  isModal?: boolean;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  language,
  onClose,
  isModal = false,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    return localStorage.getItem('muslim_shop_prayer_city') || 'atyrau';
  });
  const [now, setNow] = useState<Date>(new Date());
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const t = translations[language];

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCity = KAZAKHSTAN_CITIES.find((c) => c.id === selectedCityId) || KAZAKHSTAN_CITIES[0];

  const handleSelectCity = (city: CityLocation) => {
    setSelectedCityId(city.id);
    localStorage.setItem('muslim_shop_prayer_city', city.id);
    setIsCityDropdownOpen(false);
  };

  const prayerData: DailyPrayerInfo = calculatePrayerTimes(currentCity, now);

  const getPrayerIcon = (id: string) => {
    switch (id) {
      case 'fajr':
        return <Moon className="w-4 h-4 text-[#81E6D9]" />;
      case 'sunrise':
        return <Sunrise className="w-4 h-4 text-[#ECC94B]" />;
      case 'dhuhr':
        return <Sun className="w-4 h-4 text-[#F6AD55]" />;
      case 'asr':
        return <Sun className="w-4 h-4 text-[#ED8936]" />;
      case 'maghrib':
        return <Sunset className="w-4 h-4 text-[#F56565]" />;
      case 'isha':
        return <Moon className="w-4 h-4 text-[#9F7AEA]" />;
      default:
        return <Clock className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  const cityName = language === 'ru' ? currentCity.nameRu : currentCity.nameKz;

  const content = (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#15151F] via-[#101018] to-[#0D0D14] border border-[#C5A059]/30 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Top Bar: City selection + Hijri Date + Close button */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#242434] mb-3">
        {/* City Selector */}
        <div className="relative">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A26] hover:bg-[#242436] border border-[#C5A059]/40 text-[#E8D49E] text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{cityName}</span>
            <ChevronDown className="w-3 h-3 text-[#A6A29A]" />
          </button>

          {isCityDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-48 max-h-56 overflow-y-auto bg-[#161622] border border-[#2D2D40] rounded-xl shadow-2xl z-30 py-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[#8A857B] font-semibold">
                {t.citySelector} ({language === 'ru' ? 'Казахстан' : 'Қазақстан'})
              </div>
              {KAZAKHSTAN_CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCity(c)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#222234] transition-colors ${
                    c.id === selectedCityId ? 'text-[#D4AF37] font-bold bg-[#1C1C2C]' : 'text-[#D6D2C9]'
                  }`}
                >
                  <span>{language === 'ru' ? c.nameRu : c.nameKz}</span>
                  {c.id === selectedCityId && <span className="text-[10px] text-[#D4AF37]">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hijri & Gregorian Dates */}
        <div className="text-right flex-1 min-w-0 pr-1">
          <div className="text-xs sm:text-sm font-serif font-bold text-[#E8D49E] truncate">
            {language === 'ru' ? prayerData.hijriStrRu : prayerData.hijriStrKz}
          </div>
          <div className="text-[10px] text-[#8C877D] truncate">
            {language === 'ru' ? prayerData.dateStrRu : prayerData.dateStrKz}
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-[#1C1C28] hover:bg-[#252538] text-[#A6A29A] hover:text-[#F4F1EA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Countdown Card */}
      {prayerData.nextPrayer && (
        <div className="mb-4 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#17261E] via-[#151D22] to-[#161624] border border-[#2E6A43]/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#22543D]/60 border border-[#38A169]/40 flex items-center justify-center flex-shrink-0 text-white shadow">
              <Clock className="w-4 h-4 text-[#68D391] animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-[#A0AEC0] font-medium">
                {t.nextPrayerLabel}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#F4F1EA] truncate">
                {language === 'ru' ? prayerData.nextPrayer.nameRu : prayerData.nextPrayer.nameKz} ·{' '}
                <span className="text-[#D4AF37]">{prayerData.nextPrayer.timeStr}</span>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-[10px] text-[#8C877D] uppercase tracking-wider">
              {t.timeLeftLabel}
            </div>
            <div className="font-mono text-xs sm:text-sm font-bold text-[#68D391] tracking-wider">
              {prayerData.timeRemainingStr}
            </div>
          </div>
        </div>
      )}

      {/* 6 Prayers Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {prayerData.prayers.map((prayer) => {
          const prayerName = language === 'ru' ? prayer.nameRu : prayer.nameKz;

          return (
            <div
              key={prayer.id}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                prayer.isCurrent
                  ? 'bg-[#1D211A] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.25)] ring-1 ring-[#D4AF37]/50'
                  : prayer.isNext
                  ? 'bg-[#15201A] border-[#38A169]/60'
                  : 'bg-[#14141E] border-[#222230] hover:border-[#333345]'
              }`}
            >
              <div className="mb-1.5 flex items-center justify-center">
                {getPrayerIcon(prayer.id)}
              </div>
              <div className="text-[10px] font-medium text-[#A6A29A] truncate w-full mb-0.5">
                {prayerName.split(' ')[0]}
              </div>
              <div
                className={`font-mono text-xs sm:text-sm font-bold tracking-tight ${
                  prayer.isCurrent ? 'text-[#D4AF37]' : 'text-[#F4F1EA]'
                }`}
              >
                {prayer.timeStr}
              </div>
              {prayer.isCurrent && (
                <span className="mt-1 px-1.5 py-0.2 rounded-full text-[8px] uppercase tracking-wider bg-[#D4AF37] text-[#0B0B0E] font-bold">
                  {t.currentPrayerLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info: Qibla & Calculation note */}
      <div className="mt-3 pt-2.5 border-t border-[#1C1C28] flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#7A756D] gap-1.5">
        <div className="flex items-center gap-1 text-[#8C877D]">
          <Compass className="w-3 h-3 text-[#C5A059]" />
          <span>{t.qiblaNotice}</span>
        </div>
        <div className="text-center sm:text-right">
          {t.prayerCalculationNote}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
};
