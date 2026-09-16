import { Category, Product, Order, StoreSettings, OrderStatus } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'muslim_shop_products_v1',
  CATEGORIES: 'muslim_shop_categories_v1',
  ORDERS: 'muslim_shop_orders_v1',
  SETTINGS: 'muslim_shop_settings_v1',
  LANG: 'muslim_shop_lang_v1',
  ADMIN_AUTH: 'muslim_shop_admin_session_v1',
};

// Initial Categories based directly on user specifications
const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-hits', nameRu: 'Хиты', nameKz: 'Хиттер', icon: '🔥', order: 1 },
  { id: 'cat-health', nameRu: 'Здоровье', nameKz: 'Денсаулық', icon: '❤️', order: 2 },
  { id: 'cat-iherb', nameRu: 'iHerb Витамины', nameKz: 'iHerb Витаминдер', icon: '💊', order: 3 },
  { id: 'cat-beauty', nameRu: 'Красота', nameKz: 'Сұлулық', icon: '✨', order: 4 },
  { id: 'cat-men', nameRu: 'Мужское здоровье', nameKz: 'Ерлер денсаулығы', icon: '💪', order: 5 },
  { id: 'cat-women', nameRu: 'Женское здоровье', nameKz: 'Әйелдер денсаулығы', icon: '🌸', order: 6 },
  { id: 'cat-diet', nameRu: 'Похудение', nameKz: 'Арықтау', icon: '⚖️', order: 7 },
  { id: 'cat-muslim', nameRu: 'Для мусульман', nameKz: 'Мұсылмандарға', icon: '🕌', order: 8 },
  { id: 'cat-natural', nameRu: 'Натуральные продукты', nameKz: 'Табиғи өнімдер', icon: '🌿', order: 9 },
  { id: 'cat-new', nameRu: 'Новинки', nameKz: 'Жаңалықтар', icon: '🌟', order: 10 },
  { id: 'cat-misc', nameRu: 'Разное', nameKz: 'Басқа', icon: '📦', order: 11 },
];

// Initial realistic products with genuine details and prices in Kazakhstan Tenge
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    titleRu: 'Масло черного тмина «Королевское» холодный отжим',
    titleKz: '«Корольдік» қара зере майы, суық сығынды',
    price: 8500,
    oldPrice: 10000,
    categoryId: 'cat-health',
    descriptionRu: 'Натуральное нерафинированное масло черного тмина первого холодного отжима. Флакон из темного медицинского стекла с дозатором. Без консервантов и добавок.',
    descriptionKz: 'Табиғи бірінші суық сығынды қара зере майы. Күңгірт шыны құтыда. Қоспасыз және бояғышсыз.',
    specsRu: 'Объем: 500 мл\nСтрана производства: Египет\nСпособ отжима: Первый холодный отжим\nТара: Темное стекло',
    specsKz: 'Көлемі: 500 мл\nӨндіруші ел: Мысыр\nСығынды түрі: Суық сығынды\nЫдыс: Күңгірт шыны',
    inStock: true,
    sku: 'MS-101-OIL',
    isHit: true,
    isNew: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    titleRu: 'Морской гидролизованный коллаген с витамином C',
    titleKz: 'С дәрумені қосылған теңіз гидролизденген коллагені',
    price: 9800,
    oldPrice: 12500,
    categoryId: 'cat-beauty',
    descriptionRu: 'Пептиды рыбного гидролизованного морского коллагена с натуральным витамином C для естественного усвоения. Легко растворяется в воде.',
    descriptionKz: 'С дәрумені бар теңіз коллаген пептидтері. Суда оңай ериді, жағымсыз иіссіз.',
    specsRu: 'Форма выпуска: Порошок\nВес: 300 г\nПорций: 30\nБез сахара и глютена',
    specsKz: 'Шығарылу түрі: Ұнтақ\nСалмағы: 300 г\nҮлестер саны: 30\nҚантсыз және глютенсіз',
    inStock: true,
    sku: 'MS-202-COL',
    isHit: true,
    isNew: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    titleRu: 'Арабский концентрированный масляный миск Black Stone',
    titleKz: 'Black Stone концентрлі араб майлы мискі',
    price: 4500,
    oldPrice: 5500,
    categoryId: 'cat-muslim',
    descriptionRu: 'Бесспиртовой масляный концентрированный парфюм (миск). Стойкий восточный аромат с благородными нотами амбры, мускуса и удового дерева.',
    descriptionKz: 'Құрамында спирті жоқ концентрлі майлы парфюм. Амбра, мускус және уд ноталары бар төзімді шығыс хош иісі.',
    specsRu: 'Объем: 6 мл\nТип: Масляный роллер\nСтойкость: до 48 часов\nБез спирта (Halal)',
    specsKz: 'Көлемі: 6 мл\nТүрі: Майлы роллер\nТұрақтылығы: 48 сағатқа дейін\nСпиртсіз (Халал)',
    inStock: true,
    sku: 'MS-303-MSK',
    isHit: true,
    isNew: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    titleRu: 'Мужской натуральный комплекс «Эпимедиумная паста»',
    titleKz: 'Ерлерге арналған табиғи «Эпимедиум пастасы» кешені',
    price: 7500,
    oldPrice: 9000,
    categoryId: 'cat-men',
    descriptionRu: 'Традиционная паста на основе цветочного меда и отборных растительных экстрактов (экстракт эпимедиума, женьшень, мака перуанская).',
    descriptionKz: 'Гүл балы мен таңдаулы өсімдік сығындылары негізіндегі дәстүрлі паста (эпимедиум, женьшень, перу макасы).',
    specsRu: 'Масса нетто: 240 г\nОригинал с голограммой\n100% натуральный состав\nХранить в сухом прохладном месте',
    specsKz: 'Таза салмағы: 240 г\nГолограммасы бар түпнұсқа\n100% табиғи құрам\nҚұрғақ салқын жерде сақтау керек',
    inStock: true,
    sku: 'MS-404-EPI',
    isHit: true,
    isNew: false,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    titleRu: 'Электронные четки с LED-подсветкой (Digital Tasbih)',
    titleKz: 'LED-жарығы бар электронды тәспі (Digital Tasbih)',
    price: 2200,
    oldPrice: 3000,
    categoryId: 'cat-muslim',
    descriptionRu: 'Компактные электронные четки на палец с удобным ремешком, функцией сброса и ярким ночным LED-дисплеем.',
    descriptionKz: 'Ыңғайлы белдігі, нөлдеу батырмасы және жарық LED-экраны бар саусаққа тағылатын ықшам электронды тәспі.',
    specsRu: 'Дисплей: 5-значный цифровой LCD\nПитание: Батарейка AG10 (в комплекте)\nМатериал: Ударопрочный пластик',
    specsKz: 'Дисплей: 5 сандық сандық LCD\nҚуат көзі: AG10 батареясы (жиынтықта)\nМатериал: Соққыға төзімді пластик',
    inStock: true,
    sku: 'MS-505-TSB',
    isHit: false,
    isNew: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    titleRu: 'Натуральный Мисвак (Сивак) в индивидуальной вакуумной упаковке',
    titleKz: 'Жеке вакуумдық қаптамадағы табиғи Мисуак (Сиуак)',
    price: 1200,
    categoryId: 'cat-muslim',
    descriptionRu: 'Традиционная палочка для гигиены полости рта из корней дерева Арак (Salvadora persica). Свежий срез, сохраняет естественную влажность.',
    descriptionKz: 'Арақ ағашының тамырынан жасалған ауыз қуысы тазалығына арналған дәстүрлі таяқша (Salvadora persica). Табиғи ылғалын сақтайды.',
    specsRu: 'Длина: ~15 см\nУпаковка: Вакуумная фольгированная\n100% натуральный продукт',
    specsKz: 'Ұзындығы: ~15 см\nҚаптамасы: Вакуумдық фольга\n100% табиғи өнім',
    inStock: true,
    sku: 'MS-606-MSW',
    isHit: true,
    isNew: false,
    isSale: false,
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    titleRu: 'Семена черного тмина сирийские цельные отборные',
    titleKz: 'Сириялық іріктелген таза қара зере дәндері',
    price: 3200,
    categoryId: 'cat-natural',
    descriptionRu: 'Отборные цельные семена черного тмина высшего качества, очищенные от примесей. Подходят для заваривания чая, перемола и кулинарии.',
    descriptionKz: 'Қоспалардан тазартылған жоғары сапалы қара зере дәндері. Шай қайнатуға, ұнтақтауға және тағамға қосуға арналған.',
    specsRu: 'Масса: 250 г\nСорт: Высший\nСтрана: Сирия\nУпаковка: Zip-lock крафт-пакет',
    specsKz: 'Салмағы: 250 г\nСорты: Жоғары\nЕл: Сирия\nҚаптама: Zip-lock крафт пакеті',
    inStock: true,
    sku: 'MS-707-SD',
    isHit: false,
    isNew: false,
    isSale: false,
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    titleRu: 'Травяной сбор детокс для очищения и похудения',
    titleKz: 'Ағзаны тазартуға және арықтауға арналған шөп шайы (Детокс)',
    price: 4900,
    oldPrice: 6200,
    categoryId: 'cat-diet',
    descriptionRu: 'Натуральный фиточай из алтайских трав для мягкого очищения организма, нормализации обмена веществ и снижения аппетита.',
    descriptionKz: 'Ағзаны жұмсақ тазартуға, зат алмасуды қалпына келтіруге және тәбетті реттеуге арналған табиғи шөп шайы.',
    specsRu: 'Количество фильтр-пакетов: 30 шт\nСостав: Сбор целебных трав\nБез искусственных ароматизаторов',
    specsKz: 'Сүзгі-пакеттер саны: 30 дана\nҚұрамы: Емдік шөптер қоспасы\nЖасанды хош иістендіргішсіз',
    inStock: true,
    sku: 'MS-808-DET',
    isHit: false,
    isNew: true,
    isSale: true,
    images: [
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'MUSLIM SHOP',
  taglineRu: 'Красота. Здоровье. Вера.',
  taglineKz: 'Сұлулық. Денсаулық. Сенім.',
  subtitleRu: 'Премиальные товары для здоровья, красоты и повседневной жизни.',
  subtitleKz: 'Денсаулық, сұлулық және күнделікті өмірге арналған премиум өнімдер.',
  city: 'Атырау',
  boutiqueNumber: 'Бутик №24',
  address: 'г. Атырау, проспект Султана Бейбарыса, 45а/5',
  whatsappNumber: '77781754241',
  instagram: 'musliim_shop06',
  gis2Url: 'https://2gis.kz/atyrau/geo/70000001094546376',
  workingHoursRu: 'Ежедневно с 10:00 до 21:00',
  workingHoursKz: 'Күн сайын сағат 10:00-ден 21:00-ге дейін',
  deliveryInfoRu: 'Быстрая доставка курьером по городу Атырау в день заказа. Доставка по Казахстану через Казпочту / СДЭК.',
  deliveryInfoKz: 'Атырау қаласы бойынша тапсырыс берілген күні жылдам жеткізу. Қазақстан бойынша Қазпошта / СДЭК арқылы жеткізу.',
  pickupInfoRu: 'г. Атырау, пр. Султана Бейбарыса, 45а/5. Выдача заказов ежедневно с 10:00 до 21:00.',
  pickupInfoKz: 'Атырау қ., Сұлтан Бейбарыс даңғылы, 45а/5. Тапсырыстарды күн сайын 10:00-ден 21:00-ге дейін алып кетуге болады.',
  currency: '₸',
  adminPin: '505534',
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#1001',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    clientName: 'Айбек',
    phone: '+7 (701) 234-56-78',
    whatsapp: '77012345678',
    city: 'Атырау',
    address: 'ул. Сатпаева 14, кв. 42',
    comment: 'Позвоните за 20 минут до приезда',
    deliveryMethod: 'delivery',
    paymentMethod: 'kaspi',
    items: [
      {
        productId: 'prod-1',
        title: 'Масло черного тмина «Королевское» холодный отжим',
        price: 8500,
        quantity: 1,
        sku: 'MS-101-OIL',
      },
      {
        productId: 'prod-3',
        title: 'Арабский концентрированный масляный миск Black Stone',
        price: 4500,
        quantity: 2,
        sku: 'MS-303-MSK',
      },
    ],
    totalAmount: 17500,
    status: 'processing',
  },
];

// Helper to remove undefined properties before sending to Firestore
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  }
  if (typeof obj === 'object') {
    const res: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        res[key] = cleanForFirestore(value);
      }
    }
    return res;
  }
  return obj;
}

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Real-time Products Sync ---
  public subscribeProducts(callback: (products: Product[]) => void): () => void {
    if (!this.isBrowser()) {
      callback(INITIAL_PRODUCTS);
      return () => {};
    }

    try {
      const colRef = collection(db, 'products');
      return onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Product[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as Product;
              list.push(data);
            });
            list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            this.saveProductsLocal(list);
            callback(list);
          } else {
            // Seed Firestore with initial products on first run
            this.seedInitialProducts();
            callback(this.getProducts());
          }
        },
        (error) => {
          console.warn('Firestore products sync error, falling back to local storage:', error);
          callback(this.getProducts());
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to products:', e);
      callback(this.getProducts());
      return () => {};
    }
  }

  public async seedInitialProducts(): Promise<void> {
    try {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      }
    } catch (e) {
      console.error('Error seeding initial products to Firestore:', e);
    }
  }

  public getProducts(): Product[] {
    if (!this.isBrowser()) return INITIAL_PRODUCTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        this.saveProductsLocal(INITIAL_PRODUCTS);
        return INITIAL_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  private saveProductsLocal(products: Product[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to cache products to localStorage', e);
    }
  }

  public saveProduct(product: Product): Product[] {
    // 1. Instant local update
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.saveProductsLocal(products);

    // 2. Persist to Firestore in the cloud
    try {
      const sanitized = cleanForFirestore(product);
      setDoc(doc(db, 'products', product.id), sanitized)
        .then(() => {
          console.log('✅ Product successfully saved to Cloud Firestore:', product.id);
        })
        .catch((err) => {
          console.error('❌ Error saving product to Firestore:', err);
        });
    } catch (e) {
      console.error('Failed to trigger Firestore product save:', e);
    }

    return products;
  }

  public deleteProduct(id: string): Product[] {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProductsLocal(products);

    try {
      deleteDoc(doc(db, 'products', id)).catch((err) => {
        console.error('Error deleting product from Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to delete product from Firestore:', e);
    }

    return products;
  }

  // --- Real-time Categories Sync ---
  public subscribeCategories(callback: (categories: Category[]) => void): () => void {
    if (!this.isBrowser()) {
      callback(INITIAL_CATEGORIES);
      return () => {};
    }

    try {
      const colRef = collection(db, 'categories');
      return onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Category[] = [];
            let hasIherb = false;
            snapshot.forEach((docSnap) => {
              const cat = docSnap.data() as Category;
              list.push(cat);
              if (cat.id === 'cat-iherb') hasIherb = true;
            });
            // Automatically ensure iHerb Vitamins category exists
            if (!hasIherb) {
              const iherbCat = INITIAL_CATEGORIES.find((c) => c.id === 'cat-iherb')!;
              list.push(iherbCat);
              setDoc(doc(db, 'categories', iherbCat.id), iherbCat, { merge: true }).catch(() => {});
            }
            list.sort((a, b) => a.order - b.order);
            this.saveCategoriesLocal(list);
            callback(list);
          } else {
            this.seedInitialCategories();
            callback(this.getCategories());
          }
        },
        (error) => {
          console.warn('Firestore categories sync error:', error);
          callback(this.getCategories());
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to categories:', e);
      callback(this.getCategories());
      return () => {};
    }
  }

  public async seedInitialCategories(): Promise<void> {
    try {
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }
    } catch (e) {
      console.error('Error seeding initial categories:', e);
    }
  }

  public getCategories(): Category[] {
    if (!this.isBrowser()) return INITIAL_CATEGORIES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        this.saveCategoriesLocal(INITIAL_CATEGORIES);
        return INITIAL_CATEGORIES;
      }
      const parsed: Category[] = JSON.parse(data);
      if (!parsed.some((c) => c.id === 'cat-iherb')) {
        const iherb = INITIAL_CATEGORIES.find((c) => c.id === 'cat-iherb')!;
        parsed.push(iherb);
      }
      return parsed.sort((a: Category, b: Category) => a.order - b.order);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  private saveCategoriesLocal(categories: Category[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to cache categories to localStorage', e);
    }
  }

  public saveCategories(categories: Category[]): void {
    this.saveCategoriesLocal(categories);
    try {
      for (const cat of categories) {
        setDoc(doc(db, 'categories', cat.id), cat, { merge: true }).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to sync categories to Firestore:', e);
    }
  }

  public saveCategory(category: Category): Category[] {
    const cats = this.getCategories();
    const index = cats.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      cats[index] = category;
    } else {
      cats.push(category);
    }
    this.saveCategories(cats);

    try {
      setDoc(doc(db, 'categories', category.id), cleanForFirestore(category)).catch((err) => {
        console.error('Error saving category to Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to save category to Firestore:', e);
    }

    return cats;
  }

  public deleteCategory(id: string): Category[] {
    const cats = this.getCategories().filter((c) => c.id !== id);
    this.saveCategoriesLocal(cats);

    try {
      deleteDoc(doc(db, 'categories', id)).catch((err) => {
        console.error('Error deleting category from Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to delete category from Firestore:', e);
    }

    return cats;
  }

  // --- Real-time Orders Sync ---
  public subscribeOrders(callback: (orders: Order[]) => void): () => void {
    if (!this.isBrowser()) {
      callback(INITIAL_ORDERS);
      return () => {};
    }

    try {
      const colRef = collection(db, 'orders');
      return onSnapshot(
        colRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Order[] = [];
            snapshot.forEach((docSnap) => {
              list.push(docSnap.data() as Order);
            });
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.saveOrdersLocal(list);
            callback(list);
          } else {
            callback(this.getOrders());
          }
        },
        (error) => {
          console.warn('Firestore orders sync error:', error);
          callback(this.getOrders());
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to orders:', e);
      callback(this.getOrders());
      return () => {};
    }
  }

  public getOrders(): Order[] {
    if (!this.isBrowser()) return INITIAL_ORDERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        this.saveOrdersLocal(INITIAL_ORDERS);
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  private saveOrdersLocal(orders: Order[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to cache orders to localStorage', e);
    }
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const nextNum = orders.length > 0
      ? Math.max(...orders.map((o) => parseInt(o.orderNumber.replace(/\D/g, '') || '1000', 10))) + 1
      : 1001;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `#${nextNum}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    orders.unshift(newOrder);
    this.saveOrdersLocal(orders);

    try {
      setDoc(doc(db, 'orders', newOrder.id), cleanForFirestore(newOrder)).catch((err) => {
        console.error('Error saving order to Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to save order to Firestore:', e);
    }

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): Order[] {
    const orders = this.getOrders().map((o) => (o.id === orderId ? { ...o, status } : o));
    this.saveOrdersLocal(orders);

    try {
      setDoc(doc(db, 'orders', orderId), { status }, { merge: true }).catch((err) => {
        console.error('Error updating order status in Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to update order status in Firestore:', e);
    }

    return orders;
  }

  // --- Real-time Settings Sync ---
  public subscribeSettings(callback: (settings: StoreSettings) => void): () => void {
    if (!this.isBrowser()) {
      callback(INITIAL_SETTINGS);
      return () => {};
    }

    try {
      const docRef = doc(db, 'settings', 'general');
      return onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = { ...INITIAL_SETTINGS, ...docSnap.data() } as StoreSettings;
            this.saveSettingsLocal(data);
            callback(data);
          } else {
            this.saveSettings(INITIAL_SETTINGS);
            callback(INITIAL_SETTINGS);
          }
        },
        (error) => {
          console.warn('Firestore settings sync error:', error);
          callback(this.getSettings());
        }
      );
    } catch (e) {
      console.warn('Failed to subscribe to settings:', e);
      callback(this.getSettings());
      return () => {};
    }
  }

  public getSettings(): StoreSettings {
    if (!this.isBrowser()) return INITIAL_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettingsLocal(INITIAL_SETTINGS);
        return INITIAL_SETTINGS;
      }
      const parsed = JSON.parse(data);
      const merged: StoreSettings = { ...INITIAL_SETTINGS, ...parsed };
      // Auto-migrate to current 2GIS, Instagram, address, and adminPin
      if (!merged.gis2Url || merged.instagram === 'muslimshop_atyrau' || merged.address.includes('Байзар') || merged.adminPin === '1234') {
        merged.gis2Url = INITIAL_SETTINGS.gis2Url;
        merged.instagram = INITIAL_SETTINGS.instagram;
        merged.address = INITIAL_SETTINGS.address;
        if (merged.adminPin === '1234') {
          merged.adminPin = '505534';
        }
        this.saveSettingsLocal(merged);
      }
      return merged;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  private saveSettingsLocal(settings: StoreSettings): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to cache settings to localStorage', e);
    }
  }

  public saveSettings(settings: StoreSettings): void {
    this.saveSettingsLocal(settings);

    try {
      setDoc(doc(db, 'settings', 'general'), cleanForFirestore(settings), { merge: true }).catch((err) => {
        console.error('Error saving settings to Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to save settings to Firestore:', e);
    }
  }

  // --- Language ---
  public getLanguage(): 'ru' | 'kz' {
    if (!this.isBrowser()) return 'ru';
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANG);
      return lang === 'kz' ? 'kz' : 'ru';
    } catch {
      return 'ru';
    }
  }

  public setLanguage(lang: 'ru' | 'kz'): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  }

  // Reset to factory defaults
  public resetToDefaults(): void {
    this.saveProductsLocal(INITIAL_PRODUCTS);
    this.saveCategoriesLocal(INITIAL_CATEGORIES);
    this.saveOrdersLocal(INITIAL_ORDERS);
    this.saveSettingsLocal(INITIAL_SETTINGS);
    this.seedInitialProducts();
    this.seedInitialCategories();
    this.saveSettings(INITIAL_SETTINGS);
  }
}

export const storageService = new StorageService();
