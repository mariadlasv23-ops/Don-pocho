import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductSize,
  ProductReview,
  CartItem,
  Order,
  StoreSettings,
  ProductCategory,
  UserProfile,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, DEFAULT_STORE_SETTINGS } from '../data/initialProducts';
import { generateOrderNumber } from '../utils/formatters';

export type BottomNavTab = 'home' | 'menu' | 'cart' | 'checkout' | 'contacts' | 'profile';

interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  reviews: Record<string, ProductReview[]>;
  userProfile: UserProfile | null;
  hasSeenWelcome: boolean;
  activeNavTab: BottomNavTab;

  selectedCategory: ProductCategory | 'all';
  searchQuery: string;
  dietaryFilter: string | null;
  appliedCoupon: { code: string; percent: number } | null;
  activeTrackingOrder: Order | null;

  // Modals
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isTrackerOpen: boolean;
  isAdminOpen: boolean;
  quickViewProduct: Product | null;

  // Actions
  setUserProfile: (profile: UserProfile | null) => void;
  setHasSeenWelcome: (seen: boolean) => void;
  setActiveNavTab: (tab: BottomNavTab) => void;
  logoutUser: () => void;

  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  setDietaryFilter: (tag: string | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsTrackerOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setQuickViewProduct: (prod: Product | null) => void;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Cart operations
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: ProductSize,
    customMix?: string[],
    customLabel?: string,
    notes?: string
  ) => void;
  updateCartQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Cart totals
  cartSubtotal: number;
  cartDiscount: number;
  cartCount: number;

  // Favorites
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Reviews
  addProductReview: (productId: string, rating: number, comment: string) => void;

  // Checkout & Orders
  createOrder: (
    orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'estimatedDeliveryMinutes'>
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Entrepreneur / Admin Catalog Management
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetToDefaultCatalog: () => void;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user profile', e);
    }
    return null;
  });

  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem('don_pochito_welcome_seen') === 'true';
    } catch {
      return false;
    }
  });

  const [activeNavTab, setActiveNavTab] = useState<BottomNavTab>('home');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_products_v6');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read stored products', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [reviews, setReviews] = useState<Record<string, ProductReview[]>>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_reviews_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read stored reviews', e);
    }
    return INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_settings_v3');
      if (saved) return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Could not read stored settings', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cart', e);
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read favorites', e);
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('don_pochito_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read orders', e);
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const setUserProfile = (profile: UserProfile | null) => {
    setUserProfileState(profile);
    if (profile) {
      localStorage.setItem('don_pochito_user', JSON.stringify(profile));
    } else {
      localStorage.removeItem('don_pochito_user');
    }
  };

  const handleSetHasSeenWelcome = (seen: boolean) => {
    setHasSeenWelcome(seen);
    localStorage.setItem('don_pochito_welcome_seen', seen ? 'true' : 'false');
  };

  const logoutUser = () => {
    setUserProfile(null);
    handleSetHasSeenWelcome(false);
    setActiveNavTab('home');
  };

  useEffect(() => {
    localStorage.setItem('don_pochito_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('don_pochito_reviews_v2', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('don_pochito_settings_v3', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('don_pochito_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('don_pochito_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('don_pochito_orders', JSON.stringify(orders));
  }, [orders]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.percent) / 100 : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize?: ProductSize,
    customMix?: string[],
    customLabel?: string,
    notes?: string
  ) => {
    const basePrice = product.price;
    const additionalPrice = selectedSize?.priceDelta || 0;
    const unitPrice = basePrice + additionalPrice;

    const sizeId = selectedSize?.id || 'standard';
    const mixHash = customMix?.sort().join('-') || 'none';
    const lineId = `${product.id}-${sizeId}-${mixHash}-${customLabel || ''}-${notes || ''}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === lineId);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          product,
          quantity,
          selectedSize,
          customMix,
          customLabel,
          notes,
          unitPrice,
        },
      ];
    });

    setActiveNavTab('cart');
  };

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'POCHITO10') {
      setAppliedCoupon({ code: clean, percent: 10 });
      return { success: true, message: '¡Cupón aplicado! 10% de descuento en tu orden.' };
    }
    if (clean === 'BIENVENIDO') {
      setAppliedCoupon({ code: clean, percent: 15 });
      return { success: true, message: '¡Descuento de bienvenida activado! 15% OFF.' };
    }
    return { success: false, message: 'Código no válido. Prueba con POCHITO10' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const addProductReview = (productId: string, rating: number, comment: string) => {
    const authorName = userProfile
      ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
      : 'Cliente Don Pochito';

    const newReview: ProductReview = {
      id: `rev_${Date.now()}`,
      author: authorName,
      rating,
      comment: comment.trim(),
      createdAt: 'Justo ahora',
    };

    setReviews((prev) => ({
      ...prev,
      [productId]: [newReview, ...(prev[productId] || [])],
    }));
  };

  const createOrder = (
    orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'estimatedDeliveryMinutes'>
  ): Order => {
    const newOrder: Order = {
      ...orderInput,
      id: 'ord_' + Date.now(),
      orderNumber: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: 'recibido',
      estimatedDeliveryMinutes: 35,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = product;
        return updated;
      }
      return [product, ...prev];
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(DEFAULT_STORE_SETTINGS);
    localStorage.removeItem('don_pochito_products_v2');
    localStorage.removeItem('don_pochito_settings_v2');
  };

  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        cart,
        favorites,
        orders,
        reviews,
        userProfile,
        hasSeenWelcome,
        activeNavTab,
        selectedCategory,
        searchQuery,
        dietaryFilter,
        appliedCoupon,
        activeTrackingOrder,
        isCartOpen,
        isCheckoutOpen,
        isTrackerOpen,
        isAdminOpen,
        quickViewProduct,
        setUserProfile,
        setHasSeenWelcome: handleSetHasSeenWelcome,
        setActiveNavTab,
        logoutUser,
        setSelectedCategory,
        setSearchQuery,
        setDietaryFilter,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsTrackerOpen,
        setIsAdminOpen,
        setQuickViewProduct,
        setActiveTrackingOrder,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartCount,
        toggleFavorite,
        isFavorite,
        addProductReview,
        createOrder,
        updateOrderStatus,
        saveProduct,
        deleteProduct,
        resetToDefaultCatalog,
        updateStoreSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
