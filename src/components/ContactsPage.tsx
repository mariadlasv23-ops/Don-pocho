import React from 'react';
import { MapPin, Phone, Clock, MessageCircle, ShieldAlert, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_REGULATIONS } from '../data/initialProducts';

export const ContactsPage: React.FC = () => {
  const { settings, setActiveNavTab } = useStore();

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6 text-left">
      <button
        onClick={() => setActiveNavTab('home')}
        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#910608] hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Catálogo</span>
      </button>

      {/* Main Contact Card */}
      <div className="bg-white rounded-3xl border border-[#95BBEA]/40 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-[#F8E6A0] text-[#910608] text-[11px] font-extrabold uppercase tracking-wider">
            Visítanos o Escríbenos
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#910608] font-display mt-2">
            Contactos Don Pochito
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Estamos listos para atenderte en nuestro local de Chincha o llevar tu pedido a domicilio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#F8E6A0] space-y-1.5">
            <div className="flex items-center gap-2 text-[#910608] font-extrabold text-xs uppercase">
              <MapPin className="w-4 h-4" />
              <span>Dirección del Local</span>
            </div>
            <p className="text-sm font-bold text-stone-800">
              Sebastian Barranca 1696, Pueblo Nuevo, Chincha.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#F8E6A0] space-y-1.5">
            <div className="flex items-center gap-2 text-[#910608] font-extrabold text-xs uppercase">
              <Phone className="w-4 h-4" />
              <span>Teléfono / WhatsApp</span>
            </div>
            <p className="text-lg font-extrabold text-[#910608] font-mono">
              983 344 508
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Clock className="w-4 h-4 text-[#910608]" />
          <span>Horario de atención: <strong>{settings.openingHours}</strong></span>
        </div>

        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            '¡Hola Don Pochito! Deseo hacer una consulta o pedido.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-full py-4 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] font-extrabold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Escribir por WhatsApp (+51 983 344 508)</span>
        </a>
      </div>

      {/* Reglamento para Ocasiones Especiales */}
      <div className="bg-white rounded-3xl border border-[#95BBEA]/40 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#910608]">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-lg font-extrabold font-display">
            Reglamento para Pedidos y Ocasiones Especiales
          </h2>
        </div>
        <ul className="space-y-2.5">
          {STORE_REGULATIONS.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-[#910608] shrink-0 mt-0.5" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
