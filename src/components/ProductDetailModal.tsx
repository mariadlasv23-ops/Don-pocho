import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  Plus,
  Minus,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import { containsProfanity } from '../utils/profanityFilter';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    settings,
    addToCart,
    toggleFavorite,
    isFavorite,
    reviews,
    addProductReview,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewWarning, setReviewWarning] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const favorited = isFavorite(product.id);
  const productReviews = reviews[product.id] || [];

  const selectedSize =
    product.sizes && product.sizes.length > 0 ? product.sizes[selectedSizeIndex] : undefined;

  const unitPrice = product.price + (selectedSize ? selectedSize.priceDelta : 0);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setQuickViewProduct(null);
  };

  const handleOrderWhatsApp = () => {
    const sizeText = selectedSize ? ` (${selectedSize.name})` : '';
    const msg = `¡Hola Don Pochito! Quiero pedir:\n• ${quantity}x *${product.name}*${sizeText}\nTotal: ${formatPrice(
      totalPrice,
      settings.currencySymbol
    )}`;
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewWarning('');
    setReviewSuccess(false);

    if (!reviewComment.trim()) return;

    if (containsProfanity(reviewComment)) {
      setReviewWarning(
        'Por favor, mantengamos un ambiente respetuoso. Tu comentario no ha sido publicado'
      );
      return;
    }

    addProductReview(product.id, reviewRating, reviewComment);
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3E2B1E]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#D4ADAE]/40 overflow-hidden my-4 text-left max-h-[92vh] flex flex-col">
        {/* Top bar */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[#3E2B1E] hover:bg-white shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Large Product Image */}
            <div className="relative bg-[#FBF7E9] aspect-[4/3] md:aspect-auto md:min-h-[360px]">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                }}
              />

              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 left-4 p-2.5 rounded-full bg-white/90 text-[#7F5D46] hover:text-rose-600 shadow-sm transition-all cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            {/* Right Column: Title, Price, Quantity, Size, CTA */}
            <div className="p-6 md:p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#7F5D46]">
                  <span className="uppercase tracking-wider font-bold">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#3E2B1E]">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold tabular-nums">{product.rating.toFixed(1)}</span>
                    <span className="text-stone-400">
                      ({product.reviewsCount + productReviews.length})
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#3E2B1E] leading-tight">
                  {product.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#5C412F]/85 leading-relaxed">
                  {product.description}
                </p>

                {/* Size / Portion Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#D4ADAE]/30">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C412F] block">
                      Tamaño / Porción:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.sizes.map((size, idx) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSizeIndex(idx)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedSizeIndex === idx
                              ? 'border-[#7F5D46] bg-[#D4ADAE]/25 text-[#3E2B1E] font-bold'
                              : 'border-stone-200 text-stone-600 hover:border-[#D4ADAE]'
                          }`}
                        >
                          <p className="text-xs">{size.name}</p>
                          <p className="text-[10px] text-stone-400 mt-0.5">{size.servings}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#D4ADAE]/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#D4ADAE]/60 rounded-xl bg-[#FBF7E9] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#7F5D46] hover:bg-white rounded-lg cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-[#3E2B1E] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-[#7F5D46] hover:bg-white rounded-lg cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-4 bg-[#7F5D46] hover:bg-[#6A4C38] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Agregar al Carrito</span>
                  </button>
                </div>

                <button
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir por WhatsApp</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7F5D46]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Preparado fresco al momento · Calidad Don Pochito</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section (Estilo Imagen 3) */}
          <div className="p-6 md:p-8 bg-[#FBF7E9]/70 border-t border-[#D4ADAE]/30 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#3E2B1E] font-display">
                Reseñas y Calificaciones ({productReviews.length})
              </h3>
            </div>

            {/* Leave a Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="bg-white p-4 rounded-2xl border border-[#D4ADAE]/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5C412F]">Deja tu calificación:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value);
                    setReviewWarning('');
                  }}
                  placeholder="Cuéntanos qué te pareció este plato..."
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#FBF7E9]/50 border border-[#D4ADAE]/50 rounded-xl outline-none focus:border-[#7F5D46]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#7F5D46] hover:bg-[#6A4C38] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>

              {reviewWarning && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{reviewWarning}</span>
                </div>
              )}

              {reviewSuccess && (
                <p className="text-xs text-emerald-700 font-semibold">
                  ¡Gracias! Tu reseña ha sido publicada.
                </p>
              )}
            </form>

            {/* Reviews List */}
            {productReviews.length > 0 ? (
              <div className="space-y-3">
                {productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-4 rounded-2xl border border-[#D4ADAE]/30 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3E2B1E]">{rev.author}</span>
                      <span className="text-[11px] text-stone-400">{rev.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#5C412F] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7F5D46]/70 text-center py-2">
                Sé el primero en calificar este producto.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
