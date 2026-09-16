import { CartItem, OrderItem, Language, Product } from '../types';

/**
 * Formats a number into Kazakhstani Tenge format, e.g. "8 000 ₸"
 */
export function formatTenge(amount: number): string {
  return `${amount.toLocaleString('ru-RU')} ₸`;
}

/**
 * Builds a direct WhatsApp click-to-chat URL with pre-filled order text
 */
export function generateWhatsAppOrderUrl({
  whatsappNumber,
  items,
  totalAmount,
  clientName,
  phone,
  address,
  deliveryMethod,
  orderNumber,
  language = 'ru',
  comment,
}: {
  whatsappNumber: string;
  items: (CartItem | OrderItem)[];
  totalAmount: number;
  clientName?: string;
  phone?: string;
  address?: string;
  deliveryMethod?: string;
  orderNumber?: string;
  language?: Language;
  comment?: string;
}): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '77781754241';
  const isKz = language === 'kz';

  let text = isKz
    ? 'Ассалаумағалейкум! MUSLIM SHOP дүкенінен тапсырыс бергім келеді:\n\n'
    : 'Здравствуйте! Хочу оформить заказ в MUSLIM SHOP:\n\n';

  if (orderNumber) {
    text = isKz
      ? `Ассалаумағалейкум! Тапсырыс ${orderNumber} (MUSLIM SHOP):\n\n`
      : `Здравствуйте! Заказ ${orderNumber} в MUSLIM SHOP:\n\n`;
  }

  text += isKz ? '📦 Тапсырыс құрамы:\n' : '📦 Состав заказа:\n';

  items.forEach((item, idx) => {
    let title = '';
    let price = 0;
    let sku = '';

    if ('product' in item) {
      title = isKz ? (item.product.titleKz || item.product.titleRu) : item.product.titleRu;
      price = item.product.price;
      sku = item.product.sku;
    } else {
      title = item.title;
      price = item.price;
      sku = item.sku;
    }

    const skuPart = sku ? ` [${sku}]` : '';
    text += `${idx + 1}. ${title}${skuPart}\n   ${formatTenge(price)} × ${item.quantity} = ${formatTenge(price * item.quantity)}\n`;
  });

  text += `\n💰 ${isKz ? 'Жалпы сомасы' : 'Итоговая сумма'}: ${formatTenge(totalAmount)}\n`;

  if (clientName) {
    text += `👤 ${isKz ? 'Тапсырыс беруші' : 'Имя'}: ${clientName}\n`;
  }
  if (phone) {
    text += `📞 ${isKz ? 'Телефон' : 'Телефон'}: ${phone}\n`;
  }
  if (deliveryMethod) {
    text += `🚚 ${isKz ? 'Қабылдау әдісі' : 'Способ доставки'}: ${deliveryMethod}\n`;
  }
  if (address) {
    text += `📍 ${isKz ? 'Мекенжай' : 'Адрес'}: ${address}\n`;
  }
  if (comment) {
    text += `💬 ${isKz ? 'Пікір' : 'Комментарий'}: ${comment}\n`;
  }

  text += isKz
    ? '\nТауарлар қоймада бар ма және қашан жеткізіледі? Рахмет!'
    : '\nПодскажите, пожалуйста, по наличию и срокам доставки. Спасибо!';

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates instant 1-click WhatsApp order URL for a single product
 */
export function generateSingleProductWhatsAppUrl({
  whatsappNumber,
  product,
  quantity = 1,
  language = 'ru',
  isQuestion = false,
}: {
  whatsappNumber: string;
  product: Product;
  quantity?: number;
  language?: Language;
  isQuestion?: boolean;
}): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, '') || '77781754241';
  const isKz = language === 'kz';

  const title = isKz ? (product.titleKz || product.titleRu) : product.titleRu;
  const total = product.price * quantity;

  let text = '';
  if (isQuestion) {
    text = isKz
      ? `Ассалаумағалейкум! MUSLIM SHOP дүкені, мына тауар бойынша сұрағым бар еді:\n\n`
      : `Здравствуйте! Подскажите, пожалуйста, по поводу этого товара в MUSLIM SHOP:\n\n`;
  } else {
    text = isKz
      ? `Ассалаумағалейкум! 1 басумен тапсырыс бергім келеді:\n\n`
      : `Здравствуйте! Хочу заказать в 1 клик в MUSLIM SHOP:\n\n`;
  }

  text += `🌿 ${title}\n`;
  if (product.sku) {
    text += `🔖 ${isKz ? 'Артикул' : 'Артикул'}: ${product.sku}\n`;
  }
  text += `💵 ${isKz ? 'Бағасы' : 'Цена'}: ${formatTenge(product.price)}\n`;
  if (quantity > 1) {
    text += `🔢 ${isKz ? 'Саны' : 'Количество'}: ${quantity} дана\n`;
    text += `💰 ${isKz ? 'Жалпы сомасы' : 'Сумма'}: ${formatTenge(total)}\n`;
  }
  text += `\n📍 ${isKz ? 'Дүкен: Атырау, ТД «Байзар», бутик №24' : 'Магазин: г. Атырау, ТД «Байзар», 2 этаж, бутик №24'}\n`;
  text += isKz
    ? 'Қоймада бар ма және Атырау бойынша қалай жеткізіп бересіздер?'
    : 'Есть ли в наличии и как оформить доставку по Атырау?';

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Formats phone number nicely for display
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  }
  return phone;
}
