import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, Package, Truck, MessageCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

export const OrderTrackerModal: React.FC = () => {
  const {
    isTrackerOpen,
    setIsTrackerOpen,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    settings,
  } = useStore();

  const [searchCode, setSearchCode] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isTrackerOpen) return null;

  // Selected order to display: activeTrackingOrder or latest order or searched order
  const displayOrder = activeTrackingOrder || (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setSearched(true);
    const clean = searchCode.trim().toUpperCase().replace('#', '');
    const found = orders.find(
      (o) => o.orderNumber.toUpperCase() === clean || o.id === clean
    );
    if (found) {
      setActiveTrackingOrder(found);
    } else {
      setActiveTrackingOrder(null);
    }
  };

  const steps = [
    { key: 'recibido', label: 'Pedido Recibido', desc: 'Confirmado en cocina' },
    { key: 'preparando', label: 'En Preparación', desc: 'Reventando palomitas y empacando' },
    { key: 'en_camino', label: 'En Camino', desc: 'Motorizado en ruta a tu dirección' },
    { key: 'entregado', label: '¡Entregado!', desc: 'Que disfrutes tu crujido Pochito' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'recibido':
        return 0;
      case 'preparando':
        return 1;
      case 'en_camino':
        return 2;
      case 'entregado':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = displayOrder ? getStepIndex(displayOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 text-left">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-stone-900">
                Rastreo de Pedido en Vivo
              </h2>
              <p className="text-xs text-stone-500">Sigue el estado de tu entrega al instante</p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-stone-100 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ingresa tu código (ej. PCH-4921)..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-amber-600 focus:bg-white uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Consultar
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {displayOrder ? (
            <>
              {/* Order Banner */}
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                    Código de Pedido
                  </span>
                  <p className="text-xl font-extrabold text-stone-900 font-display">
                    #{displayOrder.orderNumber}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Cliente: <strong>{displayOrder.customerName}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                    Tiempo estimado
                  </span>
                  <p className="text-lg font-bold text-amber-900 font-display">
                    {displayOrder.estimatedDeliveryMinutes} min
                  </p>
                  <p className="text-[11px] text-stone-500">{displayOrder.deliveryZone}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Progreso de tu Pedido
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {steps.map((st, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={st.key} className="relative flex items-start gap-3">
                        <div
                          className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone
                              ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-amber-900'
                                : isDone
                                ? 'text-stone-900'
                                : 'text-stone-400'
                            }`}
                          >
                            {st.label}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">{st.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items summary */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Resumen de Productos ({displayOrder.items.length})
                </h3>
                <div className="space-y-2 text-xs">
                  {displayOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 border-b border-stone-100"
                    >
                      <div>
                        <span className="font-semibold text-stone-800">
                          {item.quantity}x {item.product.name}
                        </span>
                        {item.selectedSize && (
                          <span className="text-stone-500 ml-1">({item.selectedSize.name})</span>
                        )}
                        {item.customMix && (
                          <p className="text-[10px] text-amber-800">Mix: {item.customMix.join(' + ')}</p>
                        )}
                      </div>
                      <span className="font-mono text-stone-700">
                        {formatPrice(item.unitPrice * item.quantity, settings.currencySymbol)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between font-bold text-stone-900 pt-2 text-sm">
                    <span>Total Cancelado / A Cobrar:</span>
                    <span className="font-display text-amber-900 tabular-nums">
                      {formatPrice(displayOrder.total, settings.currencySymbol)}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct help for this order */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hola Pochito, tengo una consulta sobre mi pedido #${displayOrder.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Consultar por WhatsApp a Pochito sobre mi Pedido</span>
                </a>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-800">No encontramos ningún pedido activo</p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Verifica el código ingresado o realiza un pedido nuevo desde nuestro catálogo de snacks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
