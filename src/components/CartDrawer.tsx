import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { CartItem, Language } from '../types';
import { translations } from '../translations';
import { formatTenge, generateWhatsAppOrderUrl } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  whatsappNumber: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onOpenCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  language,
  whatsappNumber,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenCatalog,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl({
      whatsappNumber,
      items,
      totalAmount,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#000000]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#111116] border-l border-[#242430] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#22222E] flex items-center justify-between bg-[#14141C]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-lg font-bold text-[#F4F1EA]">
                {t.cart} ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#1C1C26] hover:bg-[#252533] text-[#A6A29A] hover:text-[#F4F1EA] transition-colors"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181822] border border-[#2B2B38] flex items-center justify-center text-[#7A756D]">
                  <ShoppingBag className="w-8 h-8 text-[#C5A059]/60" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#E6E2D8]">
                    {t.cartEmpty}
                  </h3>
                  <p className="text-xs text-[#8F8A80] mt-1 max-w-xs">
                    {t.cartEmptySubtitle}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCatalog();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1C1C26] hover:bg-[#252535] text-[#D4AF37] border border-[#C5A059]/40 text-xs font-semibold tracking-wide transition-all"
                >
                  {t.viewCatalog}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const title = language === 'ru' ? item.product.titleRu : (item.product.titleKz || item.product.titleRu);
                const image = item.product.images?.[0];

                return (
                  <div
                    key={item.productId}
                    className="p-3.5 rounded-2xl bg-[#161620] border border-[#242432] flex gap-3 items-center transition-all hover:border-[#383848]"
                  >
                    {/* Item thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#1C1C26] overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#2A2A38]">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-serif text-[10px] text-[#C5A059] font-bold">
                          MS
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-[#F4F1EA] truncate leading-tight">
                        {title}
                      </h4>
                      <div className="text-xs text-[#D4AF37] font-bold mt-1">
                        {formatTenge(item.product.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-[#2B2B38] rounded-lg bg-[#111116]">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs text-[#C5A059] hover:bg-[#20202C] rounded-l-lg transition-colors"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-[#F4F1EA]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs text-[#C5A059] hover:bg-[#20202C] rounded-r-lg transition-colors"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>

                        {/* Line total & remove */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#E6E2D8]">
                            {formatTenge(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.productId)}
                            className="p-1 rounded text-[#7E796F] hover:text-[#FC8181] hover:bg-[#2A1D1D] transition-colors"
                            title={t.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals and action buttons */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#242430] bg-[#14141C] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#A6A29A] uppercase tracking-wider">{t.total}:</span>
                <span className="font-serif text-2xl font-bold text-[#D4AF37] tracking-tight">
                  {formatTenge(totalAmount)}
                </span>
              </div>

              {/* Main Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#D4AF37] via-[#DFBF58] to-[#C5A059] hover:from-[#DFBF58] hover:to-[#B68E33] text-[#0B0B0E] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all transform active:scale-98 cursor-pointer"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct WhatsApp button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1A2E20] hover:bg-[#213B2A] border border-[#2E6A43]/60 text-[#68D391] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.orderWhatsApp}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
