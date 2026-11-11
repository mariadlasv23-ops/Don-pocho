import React from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';

interface CategoryFilterProps {
  totalResults: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ totalResults }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'pollos', label: 'Pollos' },
    { id: 'hamburguesas', label: 'Hamburguesas' },
    { id: 'bebidas', label: 'Bebidas' },
  ];

  return (
    <div id="catalogo" className="pt-4 pb-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F8E6A0] pb-4">
        <div className="text-left">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#910608]/80">
            Menú Brostería Don Pochito
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#910608] font-display mt-0.5">
            Nuestros Productos
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#910608]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar broster, mostrito, chicha..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-[#95BBEA]/60 focus:border-[#910608] rounded-2xl outline-none transition-all placeholder:text-stone-400 text-[#910608]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#910608] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#95BBEA]/40 rounded-2xl overflow-x-auto max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#86C5FF] text-[#910608] shadow-xs'
                    : 'text-stone-600 hover:text-[#910608] hover:bg-[#FFF8E7]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <span className="px-3 py-1 rounded-full bg-[#F8E6A0] text-[#910608] text-xs font-extrabold">
          {totalResults} productos
        </span>
      </div>
    </div>
  );
};
