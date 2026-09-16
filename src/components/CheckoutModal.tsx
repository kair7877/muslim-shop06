import React, { useState } from 'react';
import { X, CheckCircle, Truck, Store, MessageCircle, ArrowRight, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { CartItem, Language, DeliveryMethod, Order } from '../types';
import { translations } from '../translations';
import { formatTenge, generateWhatsAppOrderUrl } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  whatsappNumber: string;
  defaultCity?: string;
  onSubmitOrder: (orderData: {
    clientName: string;
    phone: string;
    whatsapp?: string;
    city: string;
    address: string;
    comment?: string;
    deliveryMethod: DeliveryMethod;
  }) => Order;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  language,
  whatsappNumber,
  defaultCity = 'Атырау',
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState(defaultCity);
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [errorMsg, setErrorMsg] = useState('');

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Fast 1-Click WhatsApp without filling form
  const handleInstantWhatsApp = () => {
    const url = generateWhatsAppOrderUrl({
      whatsappNumber,
      items,
      totalAmount,
      language,
    });
    window.open(url, '_blank');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg(language === 'ru' ? 'Пожалуйста, введите ваше имя' : 'Атыңызды енгізіңіз');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg(language === 'ru' ? 'Пожалуйста, введите номер телефона' : 'Телефон нөмірін енгізіңіз');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setErrorMsg(language === 'ru' ? 'Пожалуйста, укажите адрес доставки' : 'Жеткізу мекенжайын көрсетіңіз');
      return;
    }

    setErrorMsg('');
    const fullAddress = deliveryMethod === 'pickup' 
      ? (language === 'ru' ? 'Самовывоз: г. Атырау, ТД «Байзар», 2 этаж, бутик №24' : 'Өздігінен алып кету: Атырау қ., «Байзар» СО, 2 қабат, №24 бутик') 
      : `${city.trim() || 'Атырау'}, ${address.trim()}`;

    const order = onSubmitOrder({
      clientName: clientName.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      city: city.trim() || 'Атырау',
      address: fullAddress,
      comment: comment.trim() || undefined,
      deliveryMethod,
    });

    // Directly launch WhatsApp with structured order text
    const url = generateWhatsAppOrderUrl({
      whatsappNumber,
      items,
      totalAmount,
      clientName: clientName.trim(),
      phone: phone.trim(),
      address: fullAddress,
      deliveryMethod: deliveryMethod === 'pickup' ? t.pickup : t.delivery,
      orderNumber: order.orderNumber,
      language,
      comment: comment.trim() || undefined,
    });

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#111117] border border-[#2A2A38] rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#20202C] bg-[#14141E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1A3324] border border-[#276749] flex items-center justify-center text-[#48BB78]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#F4F1EA]">
                {t.checkoutTitle}
              </h2>
              <span className="text-[11px] text-[#48BB78] font-medium block">
                WhatsApp: +7 778 175-42-41
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#1C1C26] hover:bg-[#282836] text-[#A6A29A] hover:text-[#F4F1EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Miniature */}
        <div className="bg-[#171722] px-4 py-3 border-b border-[#20202C] flex items-center justify-between text-xs">
          <span className="text-[#99948A]">
            {items.length} {language === 'ru' ? 'наим. товара' : 'тауар түрі'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#99948A]">{t.total}:</span>
            <span className="font-bold text-[#D4AF37] text-sm">
              {formatTenge(totalAmount)}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Direct 1-Click Button without typing */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#132A1C] to-[#0F1E16] border border-[#276749] text-center space-y-2.5">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#68D391]">
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'ru' ? 'Мгновенный заказ в 1 клик' : '1 басумен жылдам тапсырыс'}</span>
            </div>
            <p className="text-[11px] text-[#A0AEC0] leading-snug">
              {language === 'ru' 
                ? 'Нажмите, чтобы сразу открыть WhatsApp с готовым списком товаров и отправить продавцу'
                : 'Дайын тауарлар тізімімен бірден WhatsApp-ты ашып, сатушыға жолдау үшін басыңыз'}
            </p>
            <button
              type="button"
              onClick={handleInstantWhatsApp}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-[#0A1A10] flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(37,211,102,0.3)] cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-[#0A1A10]" />
              <span>{language === 'ru' ? 'Открыть WhatsApp сразу (+7 778 175-42-41)' : 'WhatsApp-ты бірден ашу (+7 778 175-42-41)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#2A2A38]"></div>
            <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-[#7A756D] font-medium">
              {language === 'ru' ? 'или укажите данные для доставки' : 'немесе жеткізу деректерін жазыңыз'}
            </span>
            <div className="flex-grow border-t border-[#2A2A38]"></div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#331818] border border-[#7B2424] text-[#FC8181] text-xs">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Customer info */}
            <div>
              <label className="block text-xs font-medium text-[#C5A059] uppercase tracking-wider mb-1">
                {t.clientName} *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={language === 'ru' ? 'Например: Айбек' : 'Мысалы: Айбек'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#171722] border border-[#2A2A38] focus:border-[#D4AF37] text-sm text-[#F4F1EA] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A059] uppercase tracking-wider mb-1">
                {t.phone} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (778) 000-00-00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#171722] border border-[#2A2A38] focus:border-[#D4AF37] text-sm text-[#F4F1EA] outline-none transition-colors"
              />
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-xs font-medium text-[#C5A059] uppercase tracking-wider mb-2">
                {t.deliveryMethod}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    deliveryMethod === 'delivery'
                      ? 'bg-[#1C1C29] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                      : 'bg-[#15151E] border-[#252533] text-[#A6A29A] hover:border-[#38384A]'
                  }`}
                >
                  <Truck className={`w-4 h-4 mt-0.5 ${deliveryMethod === 'delivery' ? 'text-[#D4AF37]' : 'text-[#7A756D]'}`} />
                  <div>
                    <div className={`text-xs font-semibold ${deliveryMethod === 'delivery' ? 'text-[#F4F1EA]' : 'text-[#A6A29A]'}`}>
                      {t.delivery}
                    </div>
                    <div className="text-[10px] text-[#7A756D] mt-0.5">Атырау / РК</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'bg-[#1C1C29] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.15)]'
                      : 'bg-[#15151E] border-[#252533] text-[#A6A29A] hover:border-[#38384A]'
                  }`}
                >
                  <Store className={`w-4 h-4 mt-0.5 ${deliveryMethod === 'pickup' ? 'text-[#D4AF37]' : 'text-[#7A756D]'}`} />
                  <div>
                    <div className={`text-xs font-semibold ${deliveryMethod === 'pickup' ? 'text-[#F4F1EA]' : 'text-[#A6A29A]'}`}>
                      {t.pickup}
                    </div>
                    <div className="text-[10px] text-[#7A756D] mt-0.5">пр. Бейбарыса, 45а/5</div>
                  </div>
                </button>
              </div>

              {/* Pickup info box */}
              {deliveryMethod === 'pickup' && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#141A1E] border border-[#234E37]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <div>
                      <div className="text-[#E2DFD8] font-medium text-[11px] sm:text-xs">
                        г. Атырау, пр. Султана Бейбарыса, 45а/5
                      </div>
                      <div className="text-[10px] text-[#8C877D]">
                        {language === 'ru' ? 'Ежедневно с 10:00 до 21:00' : 'Күн сайын 10:00 - 21:00'}
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://2gis.kz/atyrau/geo/70000001094546376"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#183424] hover:bg-[#204631] text-[#68D391] border border-[#2B734C] text-[11px] font-bold transition-colors"
                  >
                    <span>2ГИС</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Address field (if delivery) */}
            {deliveryMethod === 'delivery' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-[#A6A29A] uppercase tracking-wider mb-1">
                      {t.city}
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#171722] border border-[#2A2A38] text-sm text-[#F4F1EA] outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#C5A059] uppercase tracking-wider mb-1">
                      {t.address} *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={language === 'ru' ? 'Улица, дом, квартира' : 'Көше, үй, пәтер'}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#171722] border border-[#2A2A38] focus:border-[#D4AF37] text-sm text-[#F4F1EA] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Comment */}
            <div>
              <label className="block text-xs font-medium text-[#A6A29A] uppercase tracking-wider mb-1">
                {t.orderComment}
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={language === 'ru' ? 'Пожелания к заказу...' : 'Тапсырысқа тілектер...'}
                className="w-full px-3.5 py-2 rounded-xl bg-[#171722] border border-[#2A2A38] text-sm text-[#F4F1EA] outline-none"
              />
            </div>

            {/* Reassurance notice */}
            <div className="p-2.5 rounded-xl bg-[#161622] border border-[#252535] flex items-center gap-2 text-[11px] text-[#A6A29A]">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
              <span>
                {language === 'ru'
                  ? 'Без онлайн-оплаты. Заказ подтверждается напрямую с продавцом в WhatsApp.'
                  : 'Онлайн төлемсіз. Тапсырыс тікелей WhatsApp арқылы сатушымен расталады.'}
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#2bf075] hover:to-[#17a594] text-white shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{t.submitOrder}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
