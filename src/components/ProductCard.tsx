import React from 'react';
import { Plus, Heart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { settings, addToCart, toggleFavorite, isFavorite, setQuickViewProduct } = useStore();
  const favorited = isFavorite(product.id);

  const categoryLabels: Record<string, string> = {
    popcorn: 'Palomitas Gourmet',
    combos: 'Combo Especial',
    snacks: 'Snack Artesanal',
    bebidas: 'Bebida de la Casa',
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If product has multiple sizes, open detail modal so user can choose size, otherwise add directly
    if (product.sizes && product.sizes.length > 1) {
      setQuickViewProduct(product);
    } else {
      addToCart(product, 1, product.sizes ? product.sizes[0] : undefined);
    }
  };

  return (
    <article
      onClick={() => setQuickViewProduct(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left"
    >
      {/* Visual Asset Container (4:3 Aspect Ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackApplied) {
              target.dataset.fallbackApplied = '1';
              target.src =
                product.category === 'bebidas'
                  ? '/src/assets/images/product_artisan_drinks_1794176903008.jpg'
                  : '/src/assets/images/hero_pochito_store_1794176889372.jpg';
            }
          }}
        />

        {/* Resilient Fallback Container */}
        <div className="hidden w-full h-full bg-gradient-to-br from-amber-50 to-amber-100 flex-col items-center justify-center p-4 text-center">
          <span className="text-4xl">🍿</span>
          <p className="text-xs font-bold text-amber-900 mt-2">{product.name}</p>
        </div>

        {/* Cream Gelato (#F8E6A0) category badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-[#F8E6A0] text-[#910608] text-[11px] font-extrabold tracking-wide px-2.5 py-1 rounded-md shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Quick Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            favorited
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/85 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
          title={favorited ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Quick View Hover Cue */}
        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-stone-900 text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>Ver detalles</span>
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-1.5">
          {/* Category & Rating as clean unboxed text */}
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span className="uppercase tracking-wider text-[11px] text-amber-800 font-semibold">
              {categoryLabels[product.category] || product.category}
            </span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title in Red Wine (#910608) */}
          <h3 className="font-extrabold text-[#910608] text-base leading-snug font-display line-clamp-1">
            {product.name}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Bottom Action */}
        <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            {product.sizes && product.sizes.length > 1 ? (
              <p className="text-[11px] font-semibold text-stone-500">
                {product.sizes.length} tamaños disponibles
              </p>
            ) : (
              <p className="text-[11px] font-semibold text-stone-500">
                Consultar por WhatsApp
              </p>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] text-xs font-extrabold rounded-xl transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            title="Agregar a mi pedido"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
};
