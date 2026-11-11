import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Settings, Menu, X, LogOut, Download } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsTrackerOpen,
    setIsAdminOpen,
    setSelectedCategory,
    setActiveNavTab,
    logoutUser,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } catch {}
      setDeferredPrompt(null);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveNavTab('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      {settings.bannerMessage && (
        <div className="bg-[#910608] text-[#FFF8E7] text-xs py-2 px-4 text-center font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{settings.bannerMessage}</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#FFF8E7]/95 backdrop-blur-md border-b border-[#F8E6A0] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-18">
            {/* Zone 1: Brand Wordmark in Red Wine (#910608) */}
            <button
              onClick={() => setActiveNavTab('home')}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#910608] font-display flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="w-9 h-9 rounded-xl bg-[#910608] text-[#F8E6A0] flex items-center justify-center text-sm font-extrabold shadow-sm">
                DP
              </span>
              <span>{settings.storeName}</span>
            </button>

            {/* Zone 2: Nav links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-[#910608]/85">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  scrollToSection('catalogo');
                }}
                className="hover:text-[#910608] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Catálogo
              </button>
              <button
                onClick={() => scrollToSection('historia')}
                className="hover:text-[#910608] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Nuestra Receta
              </button>
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="hover:text-[#910608] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Rastrear Pedido</span>
              </button>
            </nav>

            {/* Zone 3: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={handleInstallClick}
                title="Instalar App Don Pochito"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#F8E6A0] hover:bg-[#F8E6A0]/80 text-[#910608] text-xs font-extrabold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Instalar App</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                title="Panel de Gestión Don Pochito"
                className="p-2 text-[#910608] hover:bg-[#F8E6A0]/60 rounded-xl transition-colors cursor-pointer"
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={logoutUser}
                title="Salir de cuenta"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#910608] hover:bg-[#F8E6A0]/60 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>

              <button
                onClick={() => setActiveNavTab('cart')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] font-extrabold text-sm rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#910608] text-[#FFF8E7] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs">Carrito</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-[#910608] rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#F8E6A0] bg-white px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                scrollToSection('catalogo');
              }}
              className="block w-full text-left py-2 font-bold text-[#910608]"
            >
              Catálogo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveNavTab('contacts');
              }}
              className="block w-full text-left py-2 font-bold text-[#910608]"
            >
              Contactos y Dirección
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsTrackerOpen(true);
              }}
              className="block w-full text-left py-2 font-bold text-[#910608]"
            >
              Rastrear Pedido
            </button>
          </div>
        )}
      </header>
    </>
  );
};
