import React from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../translations';
import { formatTenge, generateWhatsAppOrderUrl } from '../utils/formatters';

interface OrderSuccessModalProps {
  order: Order | null;
  language: Language;
  whatsappNumber: string;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  language,
  whatsappNumber,
  onClose,
}) => {
  if (!order) return null;

  const t = translations[language];

  const handleSendWhatsApp = () => {
    const url = generateWhatsAppOrderUrl({
      whatsappNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      clientName: order.clientName,
      phone: order.phone,
      address: order.address,
      deliveryMethod: order.deliveryMethod === 'pickup' ? t.pickup : t.delivery,
      orderNumber: order.orderNumber,
      language,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-md bg-[#121218] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#1C1C26] text-[#A6A29A] hover:text-[#F4F1EA]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1A3324] border border-[#2E6A43] flex items-center justify-center mx-auto mb-4 text-[#48BB78] shadow-[0_0_20px_rgba(72,187,120,0.2)]">
          <CheckCircle2 className="w-9 h-9 text-[#48BB78]" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-[#F4F1EA] mb-1">
          {t.orderSuccessTitle}
        </h2>
        
        <div className="inline-block px-3 py-1 rounded-full bg-[#1C1C29] border border-[#C5A059]/40 text-[#D4AF37] font-mono text-sm font-bold my-2">
          {t.orderNumber}: {order.orderNumber}
        </div>

        <p className="text-xs sm:text-sm text-[#A8A49A] leading-relaxed mb-6">
          {t.orderSuccessDesc}
        </p>

        {/* Itemized Order Breakdown */}
        <div className="bg-[#171722] border border-[#252533] rounded-2xl p-4 text-left mb-6 text-xs space-y-2">
          <div className="font-semibold text-[#D4AF37] uppercase tracking-wider text-[10px] pb-1 border-b border-[#242434]">
            {language === 'kz' ? 'Тапсырыс құрамы:' : 'Состав заказа:'}
          </div>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-[#D6D2C9]">
              <span className="truncate pr-2">
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium whitespace-nowrap text-[#F4F1EA]">
                {formatTenge(item.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-[#242434] flex justify-between items-baseline font-bold text-sm">
            <span className="text-[#A6A29A] uppercase text-xs">{t.total}:</span>
            <span className="text-[#D4AF37] font-serif text-base">
              {formatTenge(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleSendWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-[#0A1A10] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all cursor-pointer active:scale-98"
          >
            <MessageCircle className="w-5 h-5 fill-[#0A1A10]" />
            <span>{t.sendViaWhatsAppDirect} (+7 778 175-42-41)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs text-[#A6A29A] hover:text-[#F4F1EA] hover:bg-[#1A1A26] transition-colors cursor-pointer"
          >
            {t.back} {language === 'kz' ? 'дүкенге' : 'в магазин'}
          </button>
        </div>
      </div>
    </div>
  );
};
