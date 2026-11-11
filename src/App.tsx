import React, { useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { LoginScreen } from './components/LoginScreen';
import { WelcomeInstallScreen } from './components/WelcomeInstallScreen';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { CartPage } from './components/CartPage';
import { ContactsPage } from './components/ContactsPage';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { EntrepreneurAdminModal } from './components/EntrepreneurAdminModal';
import { BrandStory } from './components/BrandStory';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { ProfileView } from './components/ProfileView';

const StoreContent: React.FC = () => {
  const {
    products,
    selectedCategory,
    searchQuery,
    dietaryFilter,
    userProfile,
    hasSeenWelcome,
    activeNavTab,
    setIsCheckoutOpen,
  } = useStore();

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesTagline = prod.tagline.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesIngredients = prod.ingredients?.some((ing) =>
          ing.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }

      if (dietaryFilter) {
        if (!prod.dietary || !prod.dietary.includes(dietaryFilter as any)) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, dietaryFilter]);

  // 1. Mandatory Login Screen
  if (!userProfile) {
    return <LoginScreen />;
  }

  // 2. Mandatory App Install + Welcome & Regulations Screen
  if (!hasSeenWelcome) {
    return <WelcomeInstallScreen />;
  }

  // Trigger checkout modal if navigated to checkout tab
  if (activeNavTab === 'checkout') {
    setIsCheckoutOpen(true);
  }

  // 3. Main Storefront
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E7] text-[#910608] selection:bg-[#86C5FF]/40 selection:text-[#910608] pb-16">
      <Header />

      {activeNavTab === 'profile' ? (
        <main className="flex-1">
          <ProfileView />
        </main>
      ) : activeNavTab === 'cart' ? (
        <main className="flex-1">
          <CartPage />
        </main>
      ) : activeNavTab === 'contacts' ? (
        <main className="flex-1">
          <ContactsPage />
        </main>
      ) : (
        <main className="flex-1">
          <HeroSection />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryFilter totalResults={filteredProducts.length} />
            <ProductGrid products={filteredProducts} />
          </div>

          <BrandStory />
        </main>
      )}

      <Footer />
      <BottomNav />

      {/* Global Modals */}
      <CheckoutModal />
      <ProductDetailModal />
      <OrderTrackerModal />
      <EntrepreneurAdminModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
