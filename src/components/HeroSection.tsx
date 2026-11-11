import React, { useState } from 'react';
import {
  MapPin,
  Drumstick,
  Beef,
  CupSoda,
  Sparkles,
  Megaphone,
  CalendarDays,
  ZoomIn,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { PERU_MAP_URL } from '../data/initialProducts';

export const HeroSection: React.FC = () => {
  const { settings, selectedCategory, setSelectedCategory, userProfile } = useStore();
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);

  const categoryCircles: {
    id: ProductCategory | 'all';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'all', label: 'Todos', icon: <Sparkles className="w-6 h-6" /> },
    { id: 'pollos', label: 'Pollos', icon: <Drumstick className="w-6 h-6" /> },
    { id: 'hamburguesas', label: 'Hamburguesas', icon: <Beef className="w-6 h-6" /> },
    { id: 'bebidas', label: 'Bebidas', icon: <CupSoda className="w-6 h-6" /> },
  ];

  const weeklyPromos = [
    { day: 'Miércoles de Broster', desc: 'Porción de papas extra gratis en tu Broster' },
    { day: 'Viernes de Mostrito', desc: 'Chicha personal de cortesía en pedidos desde S/ 35' },
    { day: 'Fines de Semana', desc: 'Envío gratis en Chincha en pedidos desde S/ 50' },
  ];

  const handleSelectCategory = (cat: ProductCategory | 'all') => {
    setSelectedCategory(cat);
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#FFF8E7] pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Grid: Peru Map Hero + Folleto Publicaciones Recientes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Stylized Peru Map Header Card */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-white border border-[#95BBEA]/40 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div className="absolute right-3 top-3 bottom-3 w-2/5 opacity-25 pointer-events-none flex items-center justify-center overflow-hidden">
              <img
                src={PERU_MAP_URL}
                alt="Mapa del Perú"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="relative z-10 text-left space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#910608] bg-[#F8E6A0] px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>Pueblo Nuevo, Chincha · Perú</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#910608] font-display leading-tight text-balance">
                {userProfile
                  ? `¡Hola ${userProfile.firstName}, bienvenido a ${settings.storeName}!`
                  : `Brostería Don ${settings.storeName}`}
              </h1>

              <p className="text-sm text-stone-700 leading-relaxed">
                ¡Crujiente por fuera, delicioso por dentro! Pollos broaster, mostritos, hamburguesas de carne, filetes y bebidas heladas en{' '}
                <strong className="text-[#910608]">{settings.businessAddress}</strong>.
              </p>
            </div>
          </div>

          {/* Right: Folleto - Publicaciones Recientes (Clickable to view large) */}
          <div
            onClick={() => setIsFlyerOpen(true)}
            className="lg:col-span-5 bg-white rounded-3xl border border-[#95BBEA]/40 shadow-sm p-4 sm:p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-[#910608]/40 transition-all group"
          >
            <div className="relative w-36 sm:w-44 h-48 sm:h-52 rounded-2xl overflow-hidden bg-[#FFF8E7] shrink-0 border border-[#F8E6A0] shadow-xs">
              <img
                src="/assets/aistudio/579d7bc2-0933-4dda-806e-bc43df16d6b5_229e2858.jfif"
                alt="Folleto Brostería Don Pochito"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-[#910608]/85 text-[#F8E6A0] shadow-sm">
                <ZoomIn className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-left space-y-2 flex-1 min-w-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F8E6A0] text-[#910608] text-[10px] font-extrabold uppercase tracking-wider">
                <Megaphone className="w-3 h-3" />
                <span>Publicaciones Recientes</span>
              </span>
              <h2 className="text-base font-extrabold text-[#910608] font-display leading-snug">
                ¡Nuestro Folleto Oficial!
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Visítanos en <strong>Sebastian Barranca 1696, Pueblo Nuevo, Chincha</strong> o pídelo al{' '}
                <strong className="text-[#910608]">983 344 508</strong>.
              </p>
              <span className="inline-block text-[11px] font-extrabold text-[#910608] underline">
                Toca aquí para ver en grande
              </span>
            </div>
          </div>
        </div>

        {/* Promociones por Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weeklyPromos.map((promo, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#F8E6A0] p-4 flex items-start gap-3 shadow-2xs text-left"
            >
              <span className="p-2 rounded-xl bg-[#F8E6A0] text-[#910608] shrink-0">
                <CalendarDays className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-[#910608]">{promo.day}</p>
                <p className="text-[11px] text-stone-600 mt-0.5">{promo.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Circular Category Icons right below */}
        <div className="pt-2">
          <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-10 overflow-x-auto pb-2 px-1">
            {categoryCircles.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
                >
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all shadow-sm border-2 ${
                      isActive
                        ? 'bg-[#86C5FF] text-[#910608] border-[#95BBEA] scale-105 shadow-md'
                        : 'bg-white text-[#910608] border-[#F8E6A0] group-hover:bg-[#86C5FF]/30'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span
                    className={`text-xs font-extrabold transition-colors ${
                      isActive ? 'text-[#910608]' : 'text-stone-600 group-hover:text-[#910608]'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Large Flyer Lightbox Modal */}
      {isFlyerOpen && (
        <div
          onClick={() => setIsFlyerOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#F8E6A0]"
          >
            <button
              onClick={() => setIsFlyerOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-[#910608] hover:bg-white shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/assets/aistudio/579d7bc2-0933-4dda-806e-bc43df16d6b5_229e2858.jfif"
              alt="Folleto Brostería Don Pochito en grande"
              className="w-full max-h-[82vh] object-contain bg-[#FFF8E7]"
            />
          </div>
        </div>
      )}
    </section>
  );
};
