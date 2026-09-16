export type Language = 'ru' | 'kz';

export interface Category {
  id: string;
  nameRu: string;
  nameKz: string;
  icon: string;
  order: number;
}

export interface Product {
  id: string;
  titleRu: string;
  titleKz?: string;
  price: number;
  oldPrice?: number;
  categoryId: string;
  descriptionRu: string;
  descriptionKz?: string;
  specsRu?: string;
  specsKz?: string;
  inStock: boolean;
  sku: string;
  isHit: boolean;
  isNew: boolean;
  isSale: boolean;
  images: string[];
  createdAt: string;
  isHidden?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export type DeliveryMethod = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'transfer' | 'kaspi' | 'whatsapp' | 'other';

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  clientName: string;
  phone: string;
  whatsapp?: string;
  city: string;
  address: string;
  comment?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod?: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
}

export interface StoreSettings {
  storeName: string;
  taglineRu: string;
  taglineKz: string;
  subtitleRu: string;
  subtitleKz: string;
  city: string;
  boutiqueNumber: string;
  address: string;
  whatsappNumber: string; // e.g. "77011234567"
  instagram: string;      // e.g. "musliim_shop06"
  gis2Url?: string;       // e.g. "https://2gis.kz/atyrau/geo/70000001094546376"
  workingHoursRu: string;
  workingHoursKz: string;
  deliveryInfoRu: string;
  deliveryInfoKz: string;
  pickupInfoRu: string;
  pickupInfoKz: string;
  currency: string;
  adminPin: string;
}

export type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc';

export interface FilterState {
  categoryId: string | null;
  searchQuery: string;
  sortBy: SortOption;
  onlyInStock: boolean;
  onlySale: boolean;
  minPrice?: number;
  maxPrice?: number;
}
