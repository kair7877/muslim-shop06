import React, { useState } from 'react';
import { ShoppingBag, Zap, Check, Sparkles, MessageCircle } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../translations';
import { formatTenge, generateSingleProductWhatsAppUrl } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  language: Language;
  whatsappNumber?: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  whatsappNumber = '77781754241',
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const t = translations[language];

  const title = language === 'ru' ? product.titleRu : (product.titleKz || product.titleRu);
  const description = language === 'ru' ? product.descriptionRu : (product.descriptionKz || product.descriptionRu);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product);
  };

  const handleWhatsApp1Click = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateSingleProductWhatsAppUrl({
      whatsappNumber,
      product,
      quantity: 1,
      language,
    });
    window.open(url, '_blank');
  };

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-[#121217] rounded-2xl border border-[#23232C] hover:border-[#C5A059]/40 transition-all duration-300 overflow-hidden cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(197,160,89,0.12)]"
    >
      {/* Photo Container */}
      <div className="relative aspect-square w-full bg-[#171720] overflow-hidden flex items-center justify-center">
        {mainImage && !imgError ? (
          <img
            src={mainImage}
            alt={title}
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#1A1A24] to-[#101017]">
            <div className="w-12 h-12 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] mb-2 bg-[#0B0B0E]/60">
              <Sparkles className="w-6 h-6 text-[#C5A059]" />
            </div>
            <span className="font-brand text-xs font-semibold text-[#D4AF37] tracking-widest uppercase">
              MUSLIM SHOP
            </span>
            <span className="text-[10px] text-[#7A756D] mt-0.5 tracking-wider">
              АТЫРАУ
            </span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isHit && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D4AF37] text-[#0B0B0E] tracking-wider uppercase shadow-sm">
              🔥 {t.hitBadge}
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#38A169] text-white tracking-wider uppercase shadow-sm">
              ✨ {t.newBadge}
            </span>
          )}
          {product.isSale && product.oldPrice && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E53E3E] text-white tracking-wider uppercase shadow-sm">
              {t.saleBadge}
            </span>
          )}
        </div>

        {/* Fast WhatsApp Icon top-right */}
        <button
          onClick={handleWhatsApp1Click}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-[#128C7E]/90 hover:bg-[#25D366] text-white shadow-md transition-all hover:scale-110"
          title={language === 'ru' ? 'Заказать в 1 клик в WhatsApp' : '1 басумен WhatsApp-та тапсырыс беру'}
        >
          <MessageCircle className="w-4 h-4 fill-white" />
        </button>

        {/* Stock status indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-[#0B0B0E]/75 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 bg-[#22222B] text-[#A6A29A] text-xs rounded-full border border-[#333340] font-medium">
              {t.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Product Title */}
          <h3 className="font-medium text-xs sm:text-sm text-[#F4F1EA] group-hover:text-[#E8D49E] transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-snug">
            {title}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-[#8F8A80] line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-[#1C1C24]">
          {/* Price block */}
          <div className="mb-2.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-[#D4AF37] tracking-tight">
                {formatTenge(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-[#7A756D] line-through decoration-[#9B2C2C]">
                  {formatTenge(product.oldPrice)}
                </span>
              )}
            </div>
            {product.sku && (
              <span className="text-[9px] text-[#656058] tracking-wider uppercase block mt-0.5">
                {t.sku}: {product.sku}
              </span>
            )}
          </div>

          {/* Action Buttons: "В корзину" + "Купить сейчас" */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`py-2 px-1 rounded-xl text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 transition-all border cursor-pointer ${
                isAdded
                  ? 'bg-[#2E5E3A] border-[#38A169] text-white'
                  : 'bg-[#181822] hover:bg-[#222230] text-[#E0DCD3] border-[#2E2E3C] hover:border-[#C5A059]/50'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
              title={t.addToCart}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'kz' ? 'Қосылды' : 'Добавлено'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{t.addToCart}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="py-2 px-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-gradient-to-r from-[#D4AF37] to-[#B68E33] hover:from-[#DFBF58] hover:to-[#A37B22] text-[#0B0B0E] flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={t.buyNow}
            >
              <Zap className="w-3.5 h-3.5 fill-[#0B0B0E]" />
              <span className="truncate">{t.buyNow}</span>
            </button>
          </div>

          {/* 1-Click WhatsApp direct link bar */}
          <button
            onClick={handleWhatsApp1Click}
            disabled={!product.inStock}
            className="w-full mt-2 py-1.5 px-2 rounded-lg bg-[#14281E]/60 hover:bg-[#1E3B2C] border border-[#276749]/40 text-[#68D391] text-[10px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#68D391]" />
            <span>{language === 'kz' ? '1 басумен WhatsApp' : '1 клик в WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
