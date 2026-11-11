export type ProductCategory = 'pollos' | 'hamburguesas' | 'bebidas';

export interface ProductSize {
  id: string;
  name: string;
  priceDelta: number;
  servings: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  sizes?: ProductSize[];
  ingredients: string[];
  dietary: ('artesanal' | 'popular' | 'clasico' | 'nuevo' | 'dulce' | 'salado')[];
  featured?: boolean;
  available: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: string;
  phone: string;
  loggedInAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  customMix?: string[];
  customLabel?: string;
  notes?: string;
  unitPrice: number;
}

export type PaymentMethod = 'yape_plin' | 'cash' | 'transfer' | 'card';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryZone: string;
  deliveryReference?: string;
  paymentMethod: PaymentMethod;
  paymentChangeAmount?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  status: 'recibido' | 'preparando' | 'en_camino' | 'entregado';
  createdAt: string;
  estimatedDeliveryMinutes: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  deliveryTimeEstimate: string;
  businessAddress: string;
  openingHours: string;
  instagramHandle: string;
  bannerMessage: string;
}
