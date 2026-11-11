import React from 'react';
import { Sparkles, Award, Flame, Leaf } from 'lucide-react';

export const BrandStory: React.FC = () => {
  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="historia" className="py-16 sm:py-20 bg-[#910608] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial story */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#F8E6A0] uppercase">
              <span>El Secreto de Don Pochito</span>
              <span aria-hidden="true" className="text-[#F8E6A0]">·</span>
              <span>Sabor Chinchano</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
              ¡Crujiente por fuera, delicioso por dentro!
            </h2>

            <p className="text-[#FFF8E7]/90 text-sm sm:text-base leading-relaxed">
              En Brostería Don Pochito preparamos cada plato al momento con ingredientes frescos seleccionados en Chincha. Desde nuestro clásico pollo broaster y mostritos hasta hamburguesas de carne y cremoladas de fruta natural.
            </p>

            {/* 3 Pillars */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-[#F8E6A0]/20 border border-[#F8E6A0]/30 flex items-center justify-center text-[#F8E6A0] shrink-0">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Empanizado Secreto Súper Crunch</h3>
                  <p className="text-xs text-[#FFF8E7]/80 mt-0.5 leading-relaxed">
                    Fritura dorada al punto exacto para mantener el pollo jugoso por dentro.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-[#F8E6A0]/20 border border-[#F8E6A0]/30 flex items-center justify-center text-[#F8E6A0] shrink-0">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Cremas Artesanales de la Casa</h3>
                  <p className="text-xs text-[#FFF8E7]/80 mt-0.5 leading-relaxed">
                    Ají pollero, mayonesa casera y salsas preparadas cada día.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-9 h-9 rounded-xl bg-[#F8E6A0]/20 border border-[#F8E6A0]/30 flex items-center justify-center text-[#F8E6A0] shrink-0">
                  <Leaf className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Bebidas & Cremoladas Naturales</h3>
                  <p className="text-xs text-[#FFF8E7]/80 mt-0.5 leading-relaxed">
                    Chicha morada, maracuyá y cremoladas hechas con fruta fresca.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={scrollToCatalog}
                className="px-6 py-3 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ver Catálogo Completo</span>
              </button>
            </div>
          </div>

          {/* Right Column: New Attached Illustration (Captura 2) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#F8E6A0]/40 shadow-2xl bg-[#FFF8E7]">
              <img
                src="/assets/aistudio/image_19edd05b.png"
                alt="Momentos hechos para ti - Don Pochito"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
