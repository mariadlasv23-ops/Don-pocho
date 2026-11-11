import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    settings,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveNavTab,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(
    null
  );

  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6 text-left">
      {/* Top Back & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveNavTab('home')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#910608] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>
        <span className="px-3 py-1 rounded-full bg-[#F8E6A0] text-[#910608] text-xs font-extrabold">
          {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      {/* Second Attached Image Banner (Aesthetic Cooking/Serving Illustration) */}
      <div className="bg-white rounded-3xl border border-[#95BBEA]/40 p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <img
          src="/assets/aistudio/0743efe6-3af4-4887-b66c-d94aae5d7b47_95de6a1d.png"
          alt="Equipo Don Pochito preparando tu pedido"
          className="w-36 h-36 object-contain shrink-0"
        />
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F8E6A0] text-[#910608] text-[10px] font-extrabold uppercase tracking-wider">
            Tu Pedido Don Pochito
          </span>
          <h1 className="text-2xl font-extrabold text-[#910608] font-display">
            Carrito de Compras
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Preparamos cada orden al instante con ingredientes frescos. Revisa tus productos antes de confirmar tu pedido.
          </p>
        </div>
      </div>

      {/* Free shipping progress */}
      <div className="bg-white p-4 rounded-2xl border border-[#F8E6A0] text-xs text-[#910608]">
        {remainingForFreeShipping > 0 ? (
          <p className="mb-2">
            ¡Agrega{' '}
            <strong className="tabular-nums">
              {formatPrice(remainingForFreeShipping, settings.currencySymbol)}
            </strong>{' '}
            más para envío <strong>GRATIS</strong> en Chincha!
          </p>
        ) : (
          <p className="font-extrabold mb-2">¡Calificas para Envío Gratis!</p>
        )}
        <div className="w-full bg-[#FFF8E7] h-2.5 rounded-full overflow-hidden border border-[#F8E6A0]">
          <div
            className="bg-[#86C5FF] h-full rounded-full transition-all duration-300"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#95BBEA]/40 py-16 px-6 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-[#910608]/40" />
          <p className="font-extrabold text-[#910608] font-display text-lg">
            Tu carrito está vacío
          </p>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Explora nuestros pollos broaster, mostritos, hamburguesas y bebidas heladas.
          </p>
          <button
            onClick={() => setActiveNavTab('home')}
            className="mt-3 px-6 py-3 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Ir al Catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl border border-[#95BBEA]/40 bg-white shadow-2xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover bg-[#FFF8E7] shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-extrabold text-[#910608] font-display truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Quitar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.selectedSize && (
                    <p className="text-xs text-stone-500">{item.selectedSize.name}</p>
                  )}

                  <div className="flex items-center justify-end mt-3 pt-2 border-t border-stone-100">

                    <div className="flex items-center gap-1 bg-[#FFF8E7] border border-[#95BBEA]/50 rounded-xl p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#910608] hover:bg-white rounded-lg cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold tabular-nums text-[#910608]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#910608] hover:bg-white rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coupon & Totals */}
          <div className="bg-white rounded-3xl border border-[#95BBEA]/40 p-5 space-y-4">
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#910608] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Cupón (ej. POCHITO10)"
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#FFF8E7] border border-[#95BBEA]/50 rounded-xl uppercase tracking-wider outline-none focus:border-[#910608]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
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

            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-[#910608] tabular-nums">
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
                <span className="text-sm font-extrabold text-[#910608] font-display">
                  Total estimado:
                </span>
                <span className="text-2xl font-extrabold text-[#910608] font-display tabular-nums">
                  {formatPrice(cartSubtotal - cartDiscount, settings.currencySymbol)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveNavTab('checkout')}
              className="w-full py-4 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] text-sm font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Realizar Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
