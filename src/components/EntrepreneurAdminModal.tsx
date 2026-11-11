import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Check, RefreshCw, Settings, Package, ShoppingBag, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import { formatPrice } from '../utils/formatters';

export const EntrepreneurAdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    saveProduct,
    deleteProduct,
    resetToDefaultCatalog,
    settings,
    updateStoreSettings,
    orders,
    updateOrderStatus,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Settings form local state
  const [waNumber, setWaNumber] = useState(settings.whatsappNumber);
  const [freeThreshold, setFreeThreshold] = useState(settings.freeShippingThreshold.toString());
  const [deliveryTime, setDeliveryTime] = useState(settings.deliveryTimeEstimate);
  const [bannerMsg, setBannerMsg] = useState(settings.bannerMessage);
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  if (!isAdminOpen) return null;

  // New product initial blank template
  const handleOpenCreateProduct = () => {
    setIsCreatingNew(true);
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name: '',
      tagline: '',
      description: '',
      price: 15.0,
      category: 'pollos',
      image: '/src/assets/images/hero_pochito_store_1794176889372.jpg',
      rating: 5.0,
      reviewsCount: 1,
      available: true,
      dietary: ['artesanal'],
      ingredients: [],
    });
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;
    saveProduct(editingProduct);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      whatsappNumber: waNumber.trim(),
      freeShippingThreshold: Number(freeThreshold) || 50,
      deliveryTimeEstimate: deliveryTime.trim(),
      bannerMessage: bannerMsg.trim(),
    });
    setSettingsSavedFeedback(true);
    setTimeout(() => setSettingsSavedFeedback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 text-left flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-amber-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-xs">
                🍿
              </span>
              <h2 className="text-xl font-bold font-display text-white">
                Panel de Gestión Emprendimiento Pochito
              </h2>
            </div>
            <p className="text-xs text-amber-200 mt-1">
              Administra productos, edita precios, gestiona pedidos recibidos y configura tu WhatsApp de ventas.
            </p>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2">
          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📦 Catálogo de Productos ({products.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              setEditingProduct(null);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📋 Pedidos Recibidos ({orders.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('settings');
              setEditingProduct(null);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            ⚙️ Configuración del Negocio
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {editingProduct ? (
                /* Edit / Create Form */
                <form onSubmit={handleSaveProductForm} className="space-y-4 max-w-2xl bg-stone-50 p-6 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <h3 className="text-sm font-bold text-stone-900">
                      {isCreatingNew ? 'Agregar Nuevo Producto a Pochito' : `Editar: ${editingProduct.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="Ej. Pochito Caramelo Salado"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Categoría *
                      </label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value as ProductCategory,
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                      >
                        <option value="popcorn">Palomitas Gourmet</option>
                        <option value="combos">Combos & Boxes</option>
                        <option value="snacks">Snacks & Crujientes</option>
                        <option value="bebidas">Bebidas</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Precio Regular ({settings.currencySymbol}) *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Precio Anterior / Tachado (Opcional)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={editingProduct.originalPrice || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        placeholder="Ej. 20.00"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Lema corto / Tagline
                    </label>
                    <input
                      type="text"
                      value={editingProduct.tagline}
                      onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                      placeholder="Ej. Glaseado con mantequilla de campo y escamas de sal marina"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Descripción completa
                    </label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Ruta o URL de Imagen
                      </label>
                      <input
                        type="text"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-1">
                        Distintivo / Badge (Opcional)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value || undefined })}
                        placeholder="Ej. Más Vendido, Edición Especial"
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              ) : (
                /* Products Table */
                <>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <button
                      onClick={handleOpenCreateProduct}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Nuevo Producto</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('¿Deseas restaurar todos los productos originales de Pochito?')) {
                          resetToDefaultCatalog();
                        }
                      }}
                      className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-800 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restablecer catálogo inicial</span>
                    </button>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-600 border-b border-stone-200 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Producto</th>
                          <th className="p-3">Categoría</th>
                          <th className="p-3">Precio</th>
                          <th className="p-3">Estado</th>
                          <th className="p-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {products.map((prod) => (
                          <tr key={prod.id} className="hover:bg-stone-50/80">
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                              />
                              <div>
                                <p className="font-bold text-stone-900">{prod.name}</p>
                                <p className="text-[11px] text-stone-400 line-clamp-1">{prod.tagline}</p>
                              </div>
                            </td>
                            <td className="p-3 text-stone-600 capitalize">{prod.category}</td>
                            <td className="p-3 font-bold font-mono text-stone-900">
                              {formatPrice(prod.price, settings.currencySymbol)}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() =>
                                  saveProduct({ ...prod, available: !prod.available })
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                  prod.available
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {prod.available ? 'Disponible' : 'Agotado'}
                              </button>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setIsCreatingNew(false);
                                  setEditingProduct(prod);
                                }}
                                className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded cursor-pointer"
                                title="Editar producto"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar ${prod.name}?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded cursor-pointer"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-stone-500">
                  <Package className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                  <p className="font-bold text-stone-700">Aún no hay pedidos registrados</p>
                  <p className="text-xs">Los pedidos realizados en la web aparecerán aquí en tiempo real.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                        <div>
                          <span className="font-mono font-bold text-amber-900 text-sm">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-xs text-stone-500 ml-2">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500">Estado:</span>
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              updateOrderStatus(ord.id, e.target.value as Product['available'] extends boolean ? any : any)
                            }
                            className="text-xs font-semibold bg-white border border-stone-300 rounded px-2 py-1 outline-none"
                          >
                            <option value="recibido">1. Recibido</option>
                            <option value="preparando">2. Preparando</option>
                            <option value="en_camino">3. En camino</option>
                            <option value="entregado">4. Entregado</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-stone-800">
                            Cliente: {ord.customerName}
                          </p>
                          <p className="text-stone-500">
                            Teléfono: <strong className="text-stone-700">{ord.customerPhone}</strong>
                          </p>
                          <p className="text-stone-500">
                            Dirección: {ord.deliveryAddress} ({ord.deliveryZone})
                          </p>
                          {ord.notes && <p className="text-amber-800 mt-1">Nota: {ord.notes}</p>}
                        </div>

                        <div>
                          <p className="font-semibold text-stone-800">
                            Productos ({ord.items.length}):
                          </p>
                          <ul className="text-stone-600 space-y-0.5">
                            {ord.items.map((it, idx) => (
                              <li key={idx}>
                                • {it.quantity}x {it.product.name}{' '}
                                {it.selectedSize ? `(${it.selectedSize.name})` : ''}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 text-sm font-extrabold text-stone-900 tabular-nums">
                            Total: {formatPrice(ord.total, settings.currencySymbol)} ({ord.paymentMethod})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Número de WhatsApp para recibir pedidos (con código de país)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    placeholder="Ej. 51987654321"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Aquí llegarán automáticamente los mensajes de pedidos enviados desde la tienda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Monto mínimo para Envío Gratis ({settings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    value={freeThreshold}
                    onChange={(e) => setFreeThreshold(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Tiempo estimado de entrega
                  </label>
                  <input
                    type="text"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="35 - 50 min"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Mensaje del banner superior
                </label>
                <input
                  type="text"
                  value={bannerMsg}
                  onChange={(e) => setBannerMsg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Ajustes de Pochito</span>
                </button>
              </div>

              {settingsSavedFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>¡Ajustes guardados exitosamente!</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
