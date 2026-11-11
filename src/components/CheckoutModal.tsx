import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, MapPin, Phone, User, CreditCard, Banknote, QrCode, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DELIVERY_ZONES } from '../data/initialProducts';
import { formatPrice, buildWhatsAppMessage } from '../utils/formatters';
import { PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    settings,
    createOrder,
    setIsTrackerOpen,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState(DELIVERY_ZONES[0].name);
  const [deliveryReference, setDeliveryReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape_plin');
  const [cashChange, setCashChange] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Selected zone calculation
  const currentZoneObj = DELIVERY_ZONES.find((z) => z.name === deliveryZone) || DELIVERY_ZONES[0];
  const standardFee = currentZoneObj.fee;
  // Free delivery threshold check
  const isFreeDelivery = cartSubtotal >= settings.freeShippingThreshold;
  const actualDeliveryFee = isFreeDelivery ? 0 : standardFee;
  const grandTotal = Math.max(0, cartSubtotal - cartDiscount + actualDeliveryFee);

  const handleSubmitOrder = (viaWhatsApp: boolean) => {
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert('Por favor completa tu nombre, celular y dirección de entrega para continuar.');
      return;
    }

    setIsSubmitting(true);

    const newOrder = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      deliveryZone,
      deliveryReference: deliveryReference.trim() || undefined,
      paymentMethod,
      paymentChangeAmount: paymentMethod === 'cash' && cashChange.trim() ? cashChange.trim() : undefined,
      items: cart,
      subtotal: cartSubtotal,
      deliveryFee: actualDeliveryFee,
      discount: cartDiscount,
      total: grandTotal,
      notes: orderNotes.trim() || undefined,
    });

    setIsSubmitting(false);
    setIsCheckoutOpen(false);

    if (viaWhatsApp) {
      const waEncoded = buildWhatsAppMessage(newOrder, settings);
      const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${waEncoded}`;
      window.open(waUrl, '_blank');
    }

    // Open tracker to show real-time confirmation
    setIsTrackerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 text-left">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Paso Final
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              Datos de Entrega y Pago
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Customer Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. ¿A quién le entregamos?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Tu Nombre y Apellidos *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. María de la Sierra"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Celular / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej. 987 654 321"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Destination */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Dirección de Entrega
            </h3>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Distrito / Zona de Cobertura *
              </label>
              <select
                value={deliveryZone}
                onChange={(e) => setDeliveryZone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
              >
                {DELIVERY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.name}>
                    {zone.name} — Envío: {formatPrice(zone.fee, settings.currencySymbol)} ({zone.time})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Dirección exacta (Calle, Avenida, Número, Dpto) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Ej. Calle Los Pinos 184, Dpto 402"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Referencia de entrega (Opcional)
                </label>
                <input
                  type="text"
                  value={deliveryReference}
                  onChange={(e) => setDeliveryReference(e.target.value)}
                  placeholder="Ej. Frente al parque, rejas negras"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Instrucciones o nota (Opcional)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ej. Servilletas extra, dejar en recepción"
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Forma de Pago
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Yape / Plin */}
              <button
                type="button"
                onClick={() => setPaymentMethod('yape_plin')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'yape_plin'
                    ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <span className="p-2 rounded-lg bg-purple-600 text-white shrink-0">
                  <QrCode className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-bold text-xs text-stone-900">Yape / Plin (QR)</p>
                  <p className="text-[11px] text-stone-500">Transferencia móvil inmediata</p>
                </div>
              </button>

              {/* Option 2: Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <span className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                  <Banknote className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-bold text-xs text-stone-900">Efectivo al Recibir</p>
                  <p className="text-[11px] text-stone-500">Pagas en puerta al motorizado</p>
                </div>
              </button>

              {/* Option 3: Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <span className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
                  <CreditCard className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-bold text-xs text-stone-900">Tarjeta (POS o Link)</p>
                  <p className="text-[11px] text-stone-500">Visa, Mastercard contra entrega</p>
                </div>
              </button>

              {/* Option 4: Bank Transfer */}
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <span className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
                  <span className="text-xs font-bold">BCP</span>
                </span>
                <div>
                  <p className="font-bold text-xs text-stone-900">Transferencia Bancaria</p>
                  <p className="text-[11px] text-stone-500">BCP, BBVA o Interbank</p>
                </div>
              </button>
            </div>

            {/* Payment Context Help */}
            {paymentMethod === 'yape_plin' && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Número Yape / Plin de Pochito:</p>
                  <p className="text-sm font-extrabold font-mono mt-0.5">{settings.whatsappNumber}</p>
                  <p className="text-[10px] text-purple-700">A nombre de: Pochito Delicias S.A.C.</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg p-1 border border-purple-200 flex items-center justify-center text-stone-800 font-bold text-xs shadow-xs">
                  QR 📲
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <label className="font-medium block">¿Con cuánto pagarás para enviarte el vuelto?</label>
                <input
                  type="text"
                  value={cashChange}
                  onChange={(e) => setCashChange(e.target.value)}
                  placeholder="Ej. S/ 50 o S/ 100"
                  className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs outline-none focus:border-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Section 4: Breakdown summary */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items):</span>
              <span className="font-semibold tabular-nums">{formatPrice(cartSubtotal, settings.currencySymbol)}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Descuento cupón:</span>
                <span className="tabular-nums">-{formatPrice(cartDiscount, settings.currencySymbol)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Costo de envío ({currentZoneObj.name}):</span>
              <span className="font-semibold tabular-nums">
                {actualDeliveryFee === 0 ? (
                  <strong className="text-amber-800 font-bold">¡GRATIS!</strong>
                ) : (
                  formatPrice(actualDeliveryFee, settings.currencySymbol)
                )}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-stone-900">
              <span className="text-sm font-bold font-display">Total a pagar:</span>
              <span className="text-2xl font-extrabold font-display text-amber-900 tabular-nums">
                {formatPrice(grandTotal, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Modificar Carrito
          </button>

          {/* Direct WhatsApp Ordering (Primary Choice for local LATAM businesses) */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmitOrder(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirmar y Enviar por WhatsApp</span>
          </button>

          {/* Online Web Confirmation */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmitOrder(false)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Confirmar en Web</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
