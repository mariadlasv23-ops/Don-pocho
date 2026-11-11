import React from 'react';
import { User, Phone, Calendar, LogOut, Settings, Clock, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    logoutUser,
    orders,
    settings,
    setIsAdminOpen,
    setIsTrackerOpen,
    setActiveTrackingOrder,
  } = useStore();

  return (
    <section className="max-w-2xl mx-auto px-4 py-8 pb-28 space-y-6 text-left">
      {/* User Card */}
      <div className="bg-white rounded-3xl border border-[#D4ADAE]/40 p-6 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#D4ADAE]/35 text-[#7F5D46] flex items-center justify-center shrink-0">
          <User className="w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-extrabold text-[#3E2B1E] font-display truncate">
            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Cliente Don Pochito'}
          </h2>
          {userProfile && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#7F5D46] mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {userProfile.age} años
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {userProfile.phone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-4 bg-white rounded-2xl border border-[#D4ADAE]/40 hover:border-[#7F5D46] flex items-center gap-3 transition-colors cursor-pointer text-left"
        >
          <span className="p-2.5 rounded-xl bg-[#FBF7E9] text-[#7F5D46]">
            <Settings className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#3E2B1E]">Modo Emprendedor</p>
            <p className="text-[11px] text-[#7F5D46]/80">Editar menú y pedidos</p>
          </div>
        </button>

        <a
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="p-4 bg-white rounded-2xl border border-[#D4ADAE]/40 hover:border-emerald-500 flex items-center gap-3 transition-colors cursor-pointer text-left"
        >
          <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <MessageCircle className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#3E2B1E]">WhatsApp Directo</p>
            <p className="text-[11px] text-emerald-700">+51 983 344 508</p>
          </div>
        </a>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-3xl border border-[#D4ADAE]/40 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#7F5D46]" />
          <h3 className="text-base font-extrabold text-[#3E2B1E] font-display">
            Mis Pedidos Recientes ({orders.length})
          </h3>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-[#7F5D46]/70 py-4 text-center">
            Aún no has realizado pedidos. ¡Explora nuestro catálogo!
          </p>
        ) : (
          <div className="space-y-2.5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => {
                  setActiveTrackingOrder(ord);
                  setIsTrackerOpen(true);
                }}
                className="p-3.5 rounded-2xl bg-[#FBF7E9] border border-[#D4ADAE]/30 flex items-center justify-between cursor-pointer hover:border-[#7F5D46] transition-colors"
              >
                <div>
                  <p className="text-xs font-extrabold text-[#3E2B1E] font-mono">
                    #{ord.orderNumber}
                  </p>
                  <p className="text-[11px] text-[#7F5D46]">
                    {ord.items.length} productos · {ord.status.toUpperCase()}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-[#7F5D46] tabular-nums">
                  {formatPrice(ord.total, settings.currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logoutUser}
        className="w-full py-3.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Cerrar Sesión</span>
      </button>
    </section>
  );
};
