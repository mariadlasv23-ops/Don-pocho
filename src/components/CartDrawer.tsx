import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    settings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#3E2B1E]/55 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-[#FBF7E9] shadow-2xl flex flex-col text-left">
          {/* Header */}
          <div className="p-5 border-b border-[#D4ADAE]/40 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#7F5D46]" />
              <h2 className="text-lg font-extrabold font-display text-[#3E2B1E]">
                Tu Carrito Don Pochito
              </h2>
              <span className="text-xs text-[#7F5D46] font-mono">({cart.length})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-[#7F5D46] hover:bg-[#FBF7E9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aesthetic Line-Art Illustration Banner (Estilo Imagen 2) */}
          <div className="bg-white px-5 py-3 border-b border-[#D4ADAE]/30 flex items-center gap-4">
            <svg
              viewBox="0 0 120 72"
              className="w-24 h-14 shrink-0 text-[#7F5D46]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Person 1: Happy chef with pan */}
              <circle cx="30" cy="20" r="8" fill="#D4ADAE" fillOpacity="0.35" />
              <path d="M27 19.5h.01M33 19.5h.01M27.5 23c1.5 1.5 3.5 1.5 5 0" />
              <path d="M18 48c0-9 5.5-15 12-15s12 6 12 15" />
              <path d="M38 40l14-2" />
              <ellipse cx="56" cy="38" rx="6" ry="2.5" fill="#D4ADAE" fillOpacity="0.4" />
              {/* Person 2: Happy customer eating */}
              <circle cx="88" cy="22" r="8" fill="#D4ADAE" fillOpacity="0.35" />
              <path d="M85 21.5h.01M91 21.5h.01M85.5 25c1.5 1.5 3.5 1.5 5 0" />
              <path d="M76 48c0-9 5.5-14 12-14s12 5 12 14" />
              <path d="M74 42l8-6" />
              <path d="M55 24c1-3 3-3 3-6M62 22c1-3 3-3 3-6" strokeOpacity="0.5" />
            </svg>
            <div>
              <p className="text-xs font-extrabold text-[#3E2B1E] font-display">
                Preparado con cariño artesanal
              </p>
              <p className="text-[11px] text-[#7F5D46]/85 leading-snug">
                Cada pedido sale calentito directo de nuestra cocina a tu mesa.
              </p>
            </div>
          </div>

          {/* Free shipping progress bar */}
          <div className="p-3.5 bg-[#D4ADAE]/20 border-b border-[#D4ADAE]/30 text-xs text-[#3E2B1E]">
            {remainingForFreeShipping > 0 ? (
              <p className="mb-2">
                ¡Agrega{' '}
                <strong className="text-[#7F5D46] tabular-nums">
                  {formatPrice(remainingForFreeShipping, settings.currencySymbol)}
                </strong>{' '}
                más para envío <strong>GRATIS</strong>!
              </p>
            ) : (
              <p className="text-[#7F5D46] font-bold mb-2">
                ¡Calificas para Envío Gratis a tu zona!
              </p>
            )}
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#D4ADAE]/30">
              <div
                className="bg-[#7F5D46] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="font-bold text-[#3E2B1E] font-display text-base">
                  Tu carrito está vacío
                </p>
                <p className="text-xs text-[#7F5D46]/80 max-w-xs mx-auto">
                  Explora nuestros pollos a la brasa, hamburguesas, bebidas y postres.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-2.5 bg-[#7F5D46] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#6A4C38] transition-colors cursor-pointer"
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-[#D4ADAE]/40 bg-white shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover bg-[#FBF7E9] shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#3E2B1E] font-display truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Quitar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <p className="text-[11px] text-[#7F5D46]">{item.selectedSize.name}</p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                      <span className="text-xs font-extrabold text-[#3E2B1E] font-display tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity, settings.currencySymbol)}
                      </span>

                      <div className="flex items-center gap-1 bg-[#FBF7E9] border border-[#D4ADAE]/50 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#7F5D46] hover:bg-white rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold tabular-nums text-[#3E2B1E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#7F5D46] hover:bg-white rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#D4ADAE]/40 bg-white space-y-4">
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#7F5D46] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Cupón (ej. POCHITO10)"
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-[#FBF7E9] border border-[#D4ADAE]/50 rounded-lg uppercase tracking-wider outline-none focus:border-[#7F5D46]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#7F5D46] hover:bg-[#6A4C38] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 font-medium pt-0.5">
                    <span>
                      Cupón "{appliedCoupon.code}" activo (-{appliedCoupon.percent}%)
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-stone-700 underline cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
                {couponFeedback && !appliedCoupon && (
                  <p className="text-[11px] text-rose-600">{couponFeedback.message}</p>
                )}
              </form>

              <div className="space-y-1.5 text-xs text-[#5C412F] pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#3E2B1E] tabular-nums">
                    {formatPrice(cartSubtotal, settings.currencySymbol)}
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Descuento:</span>
                    <span className="tabular-nums">
                      -{formatPrice(cartDiscount, settings.currencySymbol)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t border-stone-100">
                  <span className="text-sm font-bold text-[#3E2B1E] font-display">
                    Total estimado:
                  </span>
                  <span className="text-xl font-extrabold text-[#7F5D46] font-display tabular-nums">
                    {formatPrice(cartSubtotal - cartDiscount, settings.currencySymbol)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-[#7F5D46] hover:bg-[#6A4C38] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
