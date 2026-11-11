import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Clock, Phone, Instagram, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsAdminOpen, setIsTrackerOpen, setSelectedCategory } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-left pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-lg">
                🍿
              </span>
              <span className="text-2xl font-extrabold text-white font-display">
                {settings.storeName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Brostería Don Pochito en Chincha. Pollos broaster, mostritos, hamburguesas de carne, filetes y bebidas naturales preparados al momento.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-stone-400"
                title="Escríbenos por WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <span className="text-xs text-stone-400 font-mono font-medium">
                {settings.whatsappNumber}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('pollos');
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Pollos & Hamburguesas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Rastrear Estado de Pedido
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Panel de Emprendimiento Pochito
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Atención & Despachos
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.businessAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Despacho express en {settings.deliveryTimeEstimate}</span>
              </div>
            </div>
          </div>

          {/* Guarantee / WhatsApp Quick Action */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              Pedidos para Eventos
            </h4>
            <p className="text-xs text-stone-400">
              ¿Tienes un cumpleaños, evento corporativo o matrimonio? Preparamos baldes y bolsas personalizadas con tu logo.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                '¡Hola Pochito! Deseo cotizar snacks y palomitas para un evento especial.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Cotizar por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Clean copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Volver arriba ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
