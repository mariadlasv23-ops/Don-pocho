import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_REGULATIONS } from '../data/initialProducts';

export const WelcomeInstallScreen: React.FC = () => {
  const { userProfile, setHasSeenWelcome } = useStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    setIsInstalling(true);

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } catch {
        // Proceed even if prompt was dismissed or unavailable
      }
      setDeferredPrompt(null);
    }

    // Direct installation feedback & proceed to catalog
    setTimeout(() => {
      setIsInstalling(false);
      setHasSeenWelcome(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#95BBEA]/40 overflow-hidden text-left p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 mx-auto rounded-2xl bg-[#910608] text-[#F8E6A0] flex items-center justify-center shadow-md">
            <Download className="w-8 h-8" />
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#86C5FF] text-[#910608] flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          {userProfile && (
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#910608] pt-1">
              ¡Bienvenido(a), {userProfile.firstName} {userProfile.lastName}!
            </p>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#910608] font-display leading-tight">
            Instala la App de Don Pochito
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Para acceder a todo nuestro catálogo de pollos, hamburguesas y bebidas, instala nuestra app en tu dispositivo.
          </p>
        </div>

        {/* Reglamento Section */}
        <div className="bg-[#FFF8E7] rounded-2xl p-4 sm:p-5 border border-[#F8E6A0] space-y-3">
          <div className="flex items-center gap-2 text-[#910608]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              Nuestro Reglamento de Pedidos
            </h2>
          </div>

          <ul className="space-y-2">
            {STORE_REGULATIONS.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#910608] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory Install Button */}
        <button
          onClick={handleInstallApp}
          disabled={isInstalling}
          className="w-full py-4 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
        >
          <Download className="w-5 h-5" />
          <span>{isInstalling ? 'Instalando App...' : 'Instalar App y Continuar'}</span>
        </button>
      </div>
    </div>
  );
};
