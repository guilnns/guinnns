import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShieldCheck, ShoppingBag, Info, Heart, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ShoeModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: number, color: string) => void;
}

export default function ShoeModal({ product, onClose, onAddToCart }: ShoeModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0].name);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [sizeAlert, setSizeAlert] = useState<boolean>(false);
  const [addAnimated, setAddAnimated] = useState<boolean>(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeAlert(true);
      setTimeout(() => setSizeAlert(false), 3000);
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    setAddAnimated(true);
    setTimeout(() => {
      setAddAnimated(false);
      onClose();
    }, 800);
  };

  // Average review rating
  const avgRating = (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl rounded-3xl bg-white text-slate-900 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-slate-100 hover:bg-slate-200 p-2.5 text-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Dynamic Image Gallery */}
        <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center relative border-r border-slate-100">
          <span className="absolute top-6 left-6 bg-slate-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {product.tag}
          </span>

          <div className="relative max-w-xs md:max-w-sm mt-8 transition-transform duration-500 hover:scale-[1.03]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto object-contain drop-shadow-2xl transform -rotate-6"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Colorways picker in left column */}
          <div className="mt-8">
            <p className="text-xs font-bold uppercase text-slate-400 text-center mb-2.5">Cores Disponíveis</p>
            <div className="flex items-center gap-3 justify-center">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`group relative h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all ${
                    selectedColor === c.name ? 'border-orange-500 scale-110 shadow-md' : 'border-slate-200 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-center text-slate-500 mt-1.5 font-medium">Cor selecionada: {selectedColor}</p>
          </div>
        </div>

        {/* Right Side: Information / Actions */}
        <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <span className="text-xs text-orange-600 font-extrabold uppercase tracking-widest block mb-1">
              Nike Basketball &bull; {product.athlete}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
              {product.name}
            </h2>

            {/* Price & Rating Summary */}
            <div className="flex items-center justify-between mt-3 pb-4 border-b border-slate-100">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-800">{avgRating}</span>
                <span className="text-[10px] text-slate-500">({product.reviews.length})</span>
              </div>
            </div>

            {/* Quick Promo description */}
            <p className="text-xs text-slate-600 mt-4 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase text-slate-800">Selecione o Tamanho BR</span>
                <span className="text-[11.5px] text-slate-500 hover:text-slate-900 underline cursor-pointer font-medium">
                  Guia de Tamanhos
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {sizeAlert && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-[11px] font-semibold mt-2"
                >
                  ⚠️ Por favor, selecione um tamanho de tênis para poder adicionar ao carrinho.
                </motion.p>
              )}
            </div>

            {/* Tabs for Tech Specs vs Reviews */}
            <div className="mt-6">
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === 'specs' ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400'
                  }`}
                >
                  Especificações Técnicas
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === 'reviews' ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-400'
                  }`}
                >
                  Comentários ({product.reviews.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="py-4">
                {activeTab === 'specs' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      {product.longDescription}
                    </p>

                    {/* Metrics Grid */}
                    <div className="mt-4 bg-slate-50 rounded-2xl p-4 gap-3 grid grid-cols-2">
                      <div className="col-span-2 text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" /> Atributos na Quadra
                      </div>
                      
                      {/* Traction */}
                      <div className="text-xs">
                        <div className="flex justify-between text-slate-500 mb-1 font-medium">
                          <span>Tração</span>
                          <span className="font-bold text-slate-800">{product.metrics.traction}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-800 h-full rounded-full" style={{ width: `${product.metrics.traction}%` }} />
                        </div>
                      </div>

                      {/* Cushioning */}
                      <div className="text-xs">
                        <div className="flex justify-between text-slate-500 mb-1 font-medium">
                          <span>Amortecimento</span>
                          <span className="font-bold text-slate-800">{product.metrics.cushioning}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-800 h-full rounded-full" style={{ width: `${product.metrics.cushioning}%` }} />
                        </div>
                      </div>

                      {/* Responsiveness */}
                      <div className="text-xs">
                        <div className="flex justify-between text-slate-500 mb-1 font-medium">
                          <span>Responsividade</span>
                          <span className="font-bold text-slate-800">{product.metrics.responsiveness}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-800 h-full rounded-full" style={{ width: `${product.metrics.responsiveness}%` }} />
                        </div>
                      </div>

                      {/* Support */}
                      <div className="text-xs">
                        <div className="flex justify-between text-slate-500 mb-1 font-medium">
                          <span>Suporte</span>
                          <span className="font-bold text-slate-800">{product.metrics.support}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-slate-800 h-full rounded-full" style={{ width: `${product.metrics.support}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-2.5">
                      <div className="flex items-start gap-1 justify-between text-xs">
                        <span className="font-bold text-slate-800 min-w-[120px]">Amortecedores:</span>
                        <span className="text-slate-600 text-right">{product.techSpecs.cushioningType}</span>
                      </div>
                      <div className="flex items-start gap-1 justify-between text-xs">
                        <span className="font-bold text-slate-800 min-w-[120px]">Solado:</span>
                        <span className="text-slate-600 text-right">{product.techSpecs.tractionPattern}</span>
                      </div>
                      <div className="flex items-start gap-1 justify-between text-xs">
                        <span className="font-bold text-slate-800 min-w-[120px]">Peso por Tênis:</span>
                        <span className="text-slate-600 text-right">{product.techSpecs.weightGrams}g</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{rev.author}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-normal font-medium">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-100 bg-slate-50 p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Preço Final</span>
              <span className="text-xl font-extrabold text-slate-900">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                disabled={addAnimated}
                className={`px-6 py-3 cursor-pointer rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                  addAnimated
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-black hover:bg-slate-900 text-white shadow-lg shadow-black/10 hover:shadow-black/20'
                }`}
              >
                {addAnimated ? (
                  <>
                    <Check className="h-4 w-4 animate-bounce" /> Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Comprar Tênis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
