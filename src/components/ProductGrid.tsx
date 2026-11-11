import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { setSearchQuery, setDietaryFilter, setSelectedCategory } = useStore();

  if (products.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50 p-8 max-w-xl mx-auto my-8">
        <span className="text-4xl">🍿</span>
        <h3 className="text-lg font-bold text-stone-900 font-display mt-3">
          No encontramos productos con esos filtros
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
          Intenta buscar con otro término o limpia los filtros activos para ver todo el menú de Pochito.
        </p>
        <button
          onClick={() => {
            setSearchQuery('');
            setDietaryFilter(null);
            setSelectedCategory('all');
          }}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer filtros</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-16">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
