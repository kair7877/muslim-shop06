import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ShoppingBag, Zap, Check, ChevronLeft, ChevronRight, Maximize2, MessageCircle, Sparkles, HelpCircle } from 'lucide-react';
import { Product, Language, Category } from '../types';
import { translations } from '../translations';
import { formatTenge, generateSingleProductWhatsAppUrl } from '../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  language: Language;
  whatsappNumber: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  language,
  whatsappNumber,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset image index and error state whenever product changes
  useEffect(() => {
    setActiveImgIndex(0);
    setImgError(false);
    setQuantity(1);
  }, [product.id]);

  const t = translations[language];
  const title = language === 'ru' ? product.titleRu : (product.titleKz || product.titleRu);
  const description = language === 'ru' ? product.descriptionRu : (product.descriptionKz || product.descriptionRu);
  const specs = language === 'ru' ? product.specsRu : (product.specsKz || product.specsRu);

  const category = categories.find((c) => c.id === product.categoryId);
  const categoryName = category
    ? language === 'ru' ? category.nameRu : (category.nameKz || category.nameRu)
    : '';

  // Extract all potential images safely
  const rawImages: string[] = [];
  if (Array.isArray(product.images)) {
    rawImages.push(...product.images.filter((img) => typeof img === 'string' && img.trim().length > 0));
  }
  if ((product as any).image && typeof (product as any).image === 'string') {
    rawImages.push((product as any).image);
  }
  if ((product as any).imageUrl && typeof (product as any).imageUrl === 'string') {
    rawImages.push((product as any).imageUrl);
  }
  const images = Array.from(new Set(rawImages));
  const currentImage = images[activeImgIndex] || images[0] || null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  const handleWhatsAppOrder = () => {
    const url = generateSingleProductWhatsAppUrl({
      whatsappNumber,
      product,
      quantity,
      language,
      isQuestion: false,
    });
    window.open(url, '_blank');
  };

  const handleWhatsAppQuestion = () => {
    const url = generateSingleProductWhatsAppUrl({
      whatsappNumber,
      product,
      quantity,
      language,
      isQuestion: true,
    });
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <div 
          className="relative w-full max-w-3xl bg-[#111116] border border-[#2A2A36] sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Clear "Назад к списку" button and Close button */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-5 py-3 bg-[#111116]/95 backdrop-blur-md border-b border-[#22222E]">
            <div className="flex items-center gap-2">
              <button
                id="product-modal-back-btn"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1C28] hover:bg-[#262638] text-[#F4F1EA] text-xs font-semibold border border-[#2D2D3E] hover:border-[#D4AF37]/50 active:scale-95 transition-all shadow-sm group"
                aria-label={language === 'ru' ? 'Назад к товарам' : 'Тауарларға қайту'}
              >
                <ArrowLeft className="w-4 h-4 text-[#D4AF37] group-hover:-translate-x-0.5 transition-transform" />
                <span>{language === 'ru' ? 'Назад' : 'Артқа'}</span>
              </button>

              {categoryName && (
                <span className="hidden sm:inline-flex items-center text-xs text-[#C5A059] font-medium tracking-wide uppercase px-2.5 py-1 rounded-lg bg-[#181824] border border-[#252535]">
                  {category?.icon} {categoryName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {categoryName && (
                <span className="sm:hidden text-[11px] text-[#C5A059] font-medium truncate max-w-[140px]">
                  {categoryName}
                </span>
              )}
              <button
                id="product-modal-close-btn"
                onClick={onClose}
                className="p-2 rounded-full bg-[#1A1A24] hover:bg-[#252533] text-[#A8A49A] hover:text-[#F4F1EA] transition-colors"
                aria-label={t.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-grow p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Photos and Gallery */}
            <div className="flex flex-col gap-3">
              <div 
                onClick={() => currentImage && !imgError && setIsLightboxOpen(true)}
                className="relative aspect-square w-full min-h-[280px] sm:min-h-[340px] rounded-2xl bg-[#161622] border border-[#262634] overflow-hidden flex items-center justify-center cursor-zoom-in group shrink-0 shadow-inner"
              >
                {currentImage && !imgError ? (
                  <img
                    key={`${product.id}-${activeImgIndex}`}
                    src={currentImage}
                    alt={title}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    loading="eager"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#1A1A26] to-[#111118]">
                    <div className="w-16 h-16 rounded-2xl bg-[#161622] border border-[#C5A059]/40 flex items-center justify-center mb-3 text-[#D4AF37] shadow-inner">
                      <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <span className="font-brand text-sm font-semibold text-[#D4AF37] tracking-widest uppercase">
                      MUSLIM SHOP
                    </span>
                    <span className="text-xs text-[#8A857C] mt-1">АТЫРАУ · БУТИК №24</span>
                    <span className="text-[11px] text-[#A6A29A] mt-2 px-3 py-1 rounded-full bg-[#1A1A24] border border-[#262636] line-clamp-1 max-w-[85%]">
                      {title}
                    </span>
                  </div>
                )}

                {currentImage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#0B0B0E]/80 text-[#D4AF37] backdrop-blur-sm border border-[#2A2A38] opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Полноэкранный просмотр"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  {product.isHit && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#D4AF37] text-[#0B0B0E] uppercase tracking-wider shadow">
                      🔥 {t.hitBadge}
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#38A169] text-white uppercase tracking-wider shadow">
                      ✨ {t.newBadge}
                    </span>
                  )}
                  {product.isSale && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#E53E3E] text-white uppercase tracking-wider shadow">
                      {t.saleBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails if multiple images exist */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImgIndex === idx
                          ? 'border-[#D4AF37] scale-95 shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                          : 'border-[#262634] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Information & Purchase options */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#F4F1EA] leading-tight mb-2">
                  {title}
                </h1>

                {/* SKU & Stock */}
                <div className="flex items-center gap-3 text-xs mb-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${
                    product.inStock
                      ? 'bg-[#1C3322] text-[#68D391] border border-[#276749]'
                      : 'bg-[#331C1C] text-[#FC8181] border border-[#742A2A]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-[#68D391]' : 'bg-[#FC8181]'}`} />
                    {product.inStock ? t.inStock : t.outOfStock}
                  </span>

                  {product.sku && (
                    <span className="text-[#8C877D] tracking-wider uppercase">
                      {t.sku}: <span className="text-[#D6D2C9]">{product.sku}</span>
                    </span>
                  )}
                </div>

                {/* Pricing display */}
                <div className="p-3.5 rounded-2xl bg-[#171722] border border-[#262634] mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#8C877D] block">{t.price}:</span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-bold text-[#D4AF37] tracking-tight">
                        {formatTenge(product.price)}
                      </span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-sm sm:text-base text-[#7E796F] line-through">
                          {formatTenge(product.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#E53E3E]/20 text-[#FC8181] border border-[#E53E3E]/40 text-xs font-bold">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Description */}
                {description && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-1.5">
                      {t.description}
                    </h4>
                    <p className="text-sm text-[#B8B4AA] leading-relaxed whitespace-pre-line">
                      {description}
                    </p>
                  </div>
                )}

                {/* Characteristics / Specs */}
                {specs && (
                  <div className="mb-5 p-3.5 rounded-xl bg-[#14141D] border border-[#22222E]">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-2">
                      {t.specs}
                    </h4>
                    <div className="text-xs text-[#A8A49A] space-y-1 whitespace-pre-line">
                      {specs}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons & Quantity */}
              <div className="mt-6 pt-4 border-t border-[#22222E] space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-[#2E2E3C] rounded-xl bg-[#171722] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-base text-[#C5A059] hover:bg-[#222230] rounded-lg transition-colors"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-[#F4F1EA]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-base text-[#C5A059] hover:bg-[#222230] rounded-lg transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-xs text-[#8C877D]">
                    {t.total}: <strong className="text-sm text-[#F4F1EA] font-semibold">{formatTenge(product.price * quantity)}</strong>
                  </div>
                </div>

                {/* Direct 1-Click WhatsApp Order Banner Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!product.inStock}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#2bf075] hover:to-[#17a594] text-white flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all transform active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{t.oneClickWhatsApp}</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`py-3 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                      isAdded
                        ? 'bg-[#2E5E3A] border-[#38A169] text-white'
                        : 'bg-[#181824] hover:bg-[#232333] text-[#F4F1EA] border-[#2E2E3F] hover:border-[#C5A059]'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>{language === 'kz' ? 'Қосылды!' : 'Добавлено!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                        <span>{t.addToCart}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-[#D4AF37] to-[#B68E33] hover:from-[#DFBF58] hover:to-[#A37B22] text-[#0B0B0E] flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 fill-[#0B0B0E]" />
                    <span>{t.buyNow}</span>
                  </button>
                </div>

                {/* Consultation / Question in WhatsApp */}
                <button
                  onClick={handleWhatsAppQuestion}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#171722] hover:bg-[#20202E] border border-[#2E2E3E] text-[#A6A29A] hover:text-[#F4F1EA] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                  <span>{t.askQuestionWhatsApp}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Gallery */}
      {isLightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-[#000000]/95 flex flex-col items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#22222E] text-white hover:bg-[#333344] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={title}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-2 p-2.5 rounded-full bg-[#111116]/80 text-[#D4AF37] hover:bg-[#1C1C24] transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImgIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 p-2.5 rounded-full bg-[#111116]/80 text-[#D4AF37] hover:bg-[#1C1C24] transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
