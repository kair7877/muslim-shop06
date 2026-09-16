import React from 'react';
import { Instagram, MessageCircle, MapPin, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { StoreSettings, Language } from '../types';
import { translations } from '../translations';

interface FooterProps {
  settings: StoreSettings;
  language: Language;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, language, onOpenAdmin }) => {
  const t = translations[language];
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  const gis2Url = settings.gis2Url || 'https://2gis.kz/atyrau/geo/70000001094546376';
  const instagramHandle = settings.instagram?.replace('@', '') || 'musliim_shop06';

  return (
    <footer className="bg-[#0D0D12] border-t border-[#1F1F2A] text-[#9A968E] pt-10 pb-24 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Store Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C5A059] flex items-center justify-center text-[#0B0B0E] font-serif font-bold text-xs">
              M
            </div>
            <span className="font-brand font-bold text-base tracking-[0.2em] text-[#F5F3EF]">
              {settings.storeName || 'MUSLIM SHOP'}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#827D74]">
            {t.footerAbout}
          </p>
          <div className="text-[11px] text-[#C5A059] font-medium tracking-wide">
            {settings.city} · {settings.boutiqueNumber}
          </div>
        </div>

        {/* Col 2: Location & Hours */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            {t.footerWorkingHoursTitle}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-[#C4C0B6]">
              <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-start gap-2 text-[#C4C0B6]">
              <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span>{language === 'ru' ? settings.workingHoursRu : settings.workingHoursKz}</span>
            </div>
            <div className="pt-1">
              <a
                href={gis2Url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14261B] hover:bg-[#1E3626] border border-[#276749]/60 hover:border-[#48BB78] text-[#68D391] text-xs font-medium transition-all group"
              >
                <span>{t.open2Gis}</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Col 3: Delivery & Pickup details */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            {t.deliveryMethod}
          </h4>
          <p className="text-xs text-[#827D74] leading-relaxed">
            {language === 'ru' ? settings.deliveryInfoRu : settings.deliveryInfoKz}
          </p>
        </div>

        {/* Col 4: Contacts & Socials */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">
            {t.footerContacts}
          </h4>
          <div className="flex flex-col gap-2">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#18261D] hover:bg-[#203327] border border-[#276749]/60 text-[#68D391] text-xs font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +{cleanPhone}</span>
            </a>

            {/* Instagram */}
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#261524] hover:bg-[#341C31] border border-[#97266D]/50 text-[#F687B3] text-xs font-medium transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#ED64A6]" />
              <span>Instagram: @{instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#1C1C26] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#706B62]">
        <div>
          © {new Date().getFullYear()} {settings.storeName}. {t.footerAllRights}
        </div>

        <button
          onClick={onOpenAdmin}
          className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-xs text-[#807B72]"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.adminTitle}</span>
        </button>
      </div>
    </footer>
  );
};
