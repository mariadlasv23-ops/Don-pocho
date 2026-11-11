import React, { useState } from 'react';
import { Lock, User, Phone, Calendar, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LoginScreen: React.FC = () => {
  const { setUserProfile } = useStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !age.trim() || !phone.trim()) {
      setError('Por favor completa todos los campos para continuar.');
      return;
    }

    setUserProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: age.trim(),
      phone: phone.trim(),
      loggedInAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#95BBEA]/40 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#910608] px-6 pt-8 pb-6 text-center text-white">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F8E6A0] text-[#910608] flex items-center justify-center shadow-md mb-3">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-[#F8E6A0] text-[#910608] text-[11px] font-extrabold uppercase tracking-wider">
            Brostería Don Pochito
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-[#FFF8E7]/85 mt-1">
            Registro rápido para acceder a nuestro menú en Chincha
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#910608] block mb-1">
                Nombre *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#910608]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError('');
                  }}
                  placeholder="Ej. María"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FFF8E7]/70 border border-[#95BBEA]/60 rounded-xl outline-none focus:border-[#910608] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#910608] block mb-1">
                Apellido *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError('');
                }}
                placeholder="Ej. López"
                className="w-full px-3 py-2.5 text-sm bg-[#FFF8E7]/70 border border-[#95BBEA]/60 rounded-xl outline-none focus:border-[#910608] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#910608] block mb-1">
                Edad *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#910608]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="10"
                  max="120"
                  required
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setError('');
                  }}
                  placeholder="Ej. 24"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FFF8E7]/70 border border-[#95BBEA]/60 rounded-xl outline-none focus:border-[#910608] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#910608] block mb-1">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#910608]/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="983 344 508"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#FFF8E7]/70 border border-[#95BBEA]/60 rounded-xl outline-none focus:border-[#910608] focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#86C5FF] hover:bg-[#95BBEA] text-[#910608] font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Ingresar a Don Pochito</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#910608]/75 pt-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Guardado de sesión seguro y privado</span>
          </div>
        </form>
      </div>
    </div>
  );
};
