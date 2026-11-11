import React from 'react';
import { Home, UtensilsCrossed, ShoppingBag, Phone, User } from 'lucide-react';
import { useStore, BottomNavTab } from '../context/StoreContext';

export const BottomNav: React.FC = () => {
  const { activeNavTab, setActiveNavTab, cartCount } = useStore();

  const handleTabClick = (tab: BottomNavTab) => {
    setActiveNavTab(tab);
    if (tab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'menu') {
      setTimeout(() => {
        const el = document.getElementById('catalogo');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems: { id: BottomNavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'menu', label: 'Menú', icon: <UtensilsCrossed className="w-5 h-5" /> },
    {
      id: 'cart',
      label: 'Carrito',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { id: 'contacts', label: 'Contactos', icon: <Phone className="w-5 h-5" /> },
    { id: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#FFF8E7]/95 backdrop-blur-md border-t border-[#F8E6A0] shadow-[0_-4px_20px_rgba(145,6,8,0.06)]">
      <div className="max-w-xl mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeNavTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#86C5FF]/40 text-[#910608]'
                  : 'text-stone-500 hover:text-[#910608]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-[#910608] text-[#FFF8E7] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-extrabold ${isActive ? 'text-[#910608]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
