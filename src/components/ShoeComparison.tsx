import React from 'react';
import { Product } from '../types';
import { X, Scale, Flame, ArrowLeftRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShoeComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  compareIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onAddToCompare: (id: string) => void;
}

export default function ShoeComparison({
  isOpen,
  onClose,
  products,
  compareIds,
  onRemoveFromCompare,
  onAddToCompare
}: ShoeComparisonProps) {
  if (!isOpen) return null;

  const compareProducts = products.filter((p) => compareIds.includes(p.id));

  // Determine key metrics to compare
  const metricKeys: { key: keyof Product['metrics']; label: string }[] = [
    { key: 'traction', label: 'Tração em Quadra' },
    { key: 'cushioning', label: 'Amortecimento de Impacto' },
    { key: 'responsiveness', label: 'Responsividade / Impulso' },
    { key: 'support', label: 'Suporte e Estabilidade' },
    { key: 'durability', label: 'Durabilidade do Solado' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-bold tracking-tight uppercase">Comparativo Nike Hoops</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Outer content container */}
        <div className="flex-1 overflow-y-auto p-6">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Scale className="h-16 w-16 mx-auto mb-4 text-slate-600 opacity-60 animate-pulse" />
              <p className="text-lg font-medium">Nenhum tênis selecionado para comparação.</p>
              <p className="text-sm mt-2">Escolha até 2 tênis na vitrine para comparar suas características técnicas.</p>
            </div>
          ) : compareProducts.length === 1 ? (
            <div className="text-center py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Visual of the single shoe */}
                <div className="rounded-xl bg-slate-800/50 border border-slate-700/60 p-6 flex flex-col items-center">
                  <span className="text-xs bg-orange-500/20 text-orange-400 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-4">
                    Tênis 1 Selecionado
                  </span>
                  <img
                    src={compareProducts[0].imageUrl}
                    alt={compareProducts[0].name}
                    className="h-44 w-44 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="font-bold text-lg mt-4">{compareProducts[0].name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{compareProducts[0].athlete}</p>
                </div>

                {/* Prompter to select a second shoe */}
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 flex flex-col items-center justify-center min-h-[250px]">
                  <ArrowLeftRight className="h-10 w-10 text-slate-500 mb-3" />
                  <h3 className="font-semibold text-slate-300">Adicione outro modelo</h3>
                  <p className="text-slate-500 text-xs text-center mt-2 max-w-xs">
                    Selecione outro tênis na vitrine para realizar a comparação cientifica de tecnologias.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 w-full max-w-xs">
                    {products
                      .filter((p) => p.id !== compareProducts[0].id)
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onAddToCompare(p.id)}
                          className="text-left text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2.5 rounded-lg font-medium flex items-center justify-between transition-colors"
                        >
                          <span>{p.name}</span>
                          <ChevronRight className="h-4 w-4 text-orange-400" />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {/* Labels Column */}
              <div className="col-span-1 flex flex-col justify-between pt-44 font-medium text-slate-400 text-xs md:text-sm">
                <div className="h-10 flex items-center border-b border-slate-800/60 pb-2">Preço</div>
                <div className="h-10 flex items-center border-b border-slate-800/60 pb-2">Atleta Assinante</div>
                <div className="h-10 flex items-center border-b border-slate-800/60 pb-2">Categoria de Jogo</div>
                <div className="h-12 flex items-center border-b border-slate-800/60 pb-2">Tipo de Amortecimento</div>
                <div className="h-12 flex items-center border-b border-slate-800/60 pb-2">Padrão de Tração</div>
                <div className="h-10 flex items-center border-b border-slate-800/60 pb-2">Peso</div>
                <div className="h-12 flex items-center border-b border-slate-800/60 pb-2">Materiais</div>
                {metricKeys.map((mk) => (
                  <div key={mk.key} className="h-16 flex items-center border-b border-slate-800/60 py-2 font-semibold text-slate-300">
                    {mk.label}
                  </div>
                ))}
              </div>

              {/* Shoes columns */}
              {compareProducts.slice(0, 2).map((shoe, idx) => (
                <div key={shoe.id} className="col-span-1 flex flex-col">
                  {/* Shoe Card Header */}
                  <div className="relative rounded-2xl bg-slate-800/40 p-4 md:p-6 mb-6 flex flex-col items-center border border-slate-800">
                    <button
                      onClick={() => onRemoveFromCompare(shoe.id)}
                      className="absolute top-2 right-2 rounded-full p-1 bg-slate-900/80 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remover da comparação"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="h-32 flex items-center justify-center">
                      <img
                        src={shoe.imageUrl}
                        alt={shoe.name}
                        className="max-h-28 object-contain transform -rotate-12 hover:rotate-0 transition-all duration-300 drop-shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400 mt-2">
                      {shoe.tag}
                    </span>
                    <h3 className="font-extrabold text-sm md:text-base text-center mt-1 truncate w-full">{shoe.name}</h3>
                  </div>

                  {/* Shoe Specs comparison row by row */}
                  <div className="h-10 border-b border-slate-800/60 pb-2 flex items-center text-sm font-bold text-orange-400">
                    R$ {shoe.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="h-10 border-b border-slate-800/60 pb-2 flex items-center text-xs md:text-sm text-white font-medium">
                    {shoe.athlete}
                  </div>
                  <div className="h-10 border-b border-slate-800/60 pb-2 flex items-center">
                    <span className={`text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      shoe.category === 'Power' ? 'bg-indigo-500/20 text-indigo-300' :
                      shoe.category === 'Speed' ? 'bg-red-500/20 text-red-300' :
                      shoe.category === 'Control' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-pink-500/20 text-pink-300'
                    }`}>
                      {shoe.category}
                    </span>
                  </div>
                  <div className="h-12 border-b border-slate-800/60 pb-2 flex items-center text-xs text-slate-300 leading-tight">
                    {shoe.techSpecs.cushioningType}
                  </div>
                  <div className="h-12 border-b border-slate-800/60 pb-2 flex items-center text-xs text-slate-300 leading-tight">
                    {shoe.techSpecs.tractionPattern}
                  </div>
                  <div className="h-10 border-b border-slate-800/60 pb-2 flex items-center text-xs md:text-sm text-slate-300">
                    {shoe.techSpecs.weightGrams}g <span className="text-[11px] text-slate-500 ml-1"> (Leveza)</span>
                  </div>
                  <div className="h-12 border-b border-slate-800/60 pb-2 flex items-center text-xs text-slate-400 leading-tight">
                    {shoe.techSpecs.materials}
                  </div>

                  {/* Rating comparison (charts / numeric percentages) */}
                  {metricKeys.map((mk) => {
                    const value = shoe.metrics[mk.key];
                    const oppositionValue = compareProducts[1 - idx]?.metrics[mk.key] || 0;
                    const isWinner = value > oppositionValue;

                    return (
                      <div key={mk.key} className="h-16 border-b border-slate-800/60 py-2 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className={isWinner ? "text-green-400" : "text-slate-300"}>
                            {value}%
                          </span>
                          {isWinner && (
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.2 rounded font-bold uppercase scale-90">
                              Melhor
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isWinner ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-slate-600'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 bg-slate-950 flex items-center justify-between">
          <p className="text-xs text-slate-400 max-w-md">
            Compare o peso leve (Sabrina 2: 330g) versus suporte máximo para impacto pesado (LeBron 21: 425g).
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold tracking-wider uppercase transition-colors"
            >
              Fechar Comparador
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
