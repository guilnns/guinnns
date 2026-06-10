import React, { useState, useMemo } from 'react';
import { PRODUCTS } from './data';
import { Product, CartItem } from './types';
import ShoeModal from './components/ShoeModal';
import CartDrawer from './components/CartDrawer';
import ShoeComparison from './components/ShoeComparison';
import {
  ShoppingBag,
  Search,
  ArrowLeftRight,
  Check,
  Award,
  Shield,
  Compass,
  Star,
  Flame,
  User,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  RefreshCw,
  TrendingUp,
  Sliders,
  HelpCircle,
  X,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // State managers
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [likedShoes, setLikedShoes] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAthlete, setSelectedAthlete] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'popularity'>('featured');

  // Interactive Quiz states
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<Product | null>(null);

  // Notifications feedback toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast helper
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: number, color: string) => {
    setCartItems((prevItems) => {
      // Check if product with same size and color already in cart
      const existingItem = prevItems.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    triggerToast(`👟 ${product.name} (Tamanho ${size}) adicionado ao carrinho!`);
  };

  const handleUpdateCartQuantity = (id: string, size: number, color: string, change: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product.id === id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item
        )
    );
  };

  const handleRemoveCartItem = (id: string, size: number, color: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id === id && item.selectedSize === size && item.selectedColor === color)
      )
    );
    triggerToast('Item removido do carrinho.');
  };

  // Toggle Favorite
  const toggleLike = (id: string) => {
    setLikedShoes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    const shoeName = PRODUCTS.find((p) => p.id === id)?.name;
    if (likedShoes.includes(id)) {
      triggerToast(`Removido dos favoritos.`);
    } else {
      triggerToast(`❤️ ${shoeName} adicionado à sua lista de desejos!`);
    }
  };

  // Compare functions
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        triggerToast('⚠️ Você só pode comparar 2 tênis de cada vez no comparador.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const handleAddToCompare = (id: string) => {
    if (compareIds.length >= 2) return;
    setCompareIds((prev) => [...prev, id]);
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.athlete.toLowerCase().includes(query) ||
          p.tag.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedAthlete !== 'All') {
      result = result.filter((p) => p.athlete === selectedAthlete);
    }

    // Sort order
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popularity') {
      // Sort by average metric score
      result.sort((a, b) => {
        const scoreA = Object.values(a.metrics).reduce((s, v) => s + v, 0);
        const scoreB = Object.values(b.metrics).reduce((s, v) => s + v, 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, selectedAthlete, sortBy]);

  // Quiz calculations
  const runQuizRecommendation = (focus: string, corte: string) => {
    // Determine shoe based on choices
    let recommendation: Product = PRODUCTS[0]; // default
    if (focus === 'impacto') {
      recommendation = PRODUCTS.find((p) => p.id === 'lebron-21') || PRODUCTS[0];
    } else if (focus === 'leveza') {
      recommendation = PRODUCTS.find((p) => p.id === 'sabrina-2') || PRODUCTS[1];
    } else if (focus === 'velocidade') {
      recommendation = PRODUCTS.find((p) => p.id === 'ja-1') || PRODUCTS[2];
    } else if (focus === 'parada') {
      recommendation = PRODUCTS.find((p) => p.id === 'kd-17') || PRODUCTS[3];
    }
    setQuizResult(recommendation);
  };

  const handleRestartQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border-2 border-slate-800 text-white font-bold text-xs px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl"
          >
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header element */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-900 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            {/* Custom stylized swoosh logo wrapper */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-2 rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-white text-base tracking-tighter">NIKE</span>
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white uppercase block leading-none">
                Hoops Showcase
              </span>
              <span className="text-[10px] text-orange-500/80 font-black tracking-widest uppercase">
                Elite Performance
              </span>
            </div>
          </div>

          {/* Center Info Banner */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Coleções Profissionais</span>
            <span className="hover:text-white transition-colors cursor-pointer text-orange-400">🏷️ Frete Grátis acima de R$1.000</span>
            <span className="hover:text-white transition-colors cursor-pointer">Nike Air Zoom Lab</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Direct Comparison Trigger */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Comparador Técnico"
            >
              <ArrowLeftRight className="h-5 w-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white font-extrabold text-[9px] h-5 w-5 flex items-center justify-center rounded-full border border-slate-900 animate-pulse">
                  {compareIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart button trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider">Carrinho</span>
              {totalCartCount > 0 && (
                <span className="absolute md:-top-1.5 md:-right-1.5 -top-1 -right-1 bg-white text-slate-950 font-black text-[10px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dynamic Marketing Hero Banner */}
        <section className="relative rounded-3xl bg-radial from-slate-900 to-slate-950 border border-slate-900 p-8 md:p-12 overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner shadow-orange-500/5">
          {/* Neon highlight glowing spheres */}
          <div className="absolute top-0 right-1/4 h-64 w-64 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 h-44 w-44 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="w-full md:w-3/5 relative z-10 text-left">
            <span className="text-[10px] bg-orange-500/20 text-orange-400 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Coleção Oficial de Quadra 2026/2027
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tighter uppercase">
              DOMINE A QUADRA.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">ENCONTRE SUA ARMA.</span>
            </h1>

            <p className="text-slate-400 text-xs md:text-sm max-w-lg mt-4 leading-relaxed font-normal">
              Escolha entre o suporte de impacto inabalável do LeBron 21, as transições fluidas do KD17, as decolagens explosivas do Ja 1 ou os cortes geométricos ultraleves do Sabrina 2. Tecnologias Zoom Air configuradas para os atletas mais letais do basquete.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const element = document.getElementById('vitrine');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 cursor-pointer bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs uppercase tracking-widest font-extrabold shadow-lg shadow-orange-600/20 hover:shadow-orange-700/30 transition-all flex items-center gap-2"
              >
                <Compass className="h-4 w-4" /> Explorar Vitrine
              </button>

              <button
                onClick={() => setShowQuiz(true)}
                className="px-6 py-3 cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-slate-200 rounded-xl text-xs uppercase tracking-widest font-extrabold transition-all flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4 text-orange-500" /> Sintonizador de Estilo
              </button>
            </div>
          </div>

          {/* Right Column decoration */}
          <div className="w-full md:w-2/5 flex justify-center relative">
            <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-full border border-slate-800/80 bg-slate-900/30 flex items-center justify-center p-6 shadow-inner">
              <img
                src="/src/assets/images/nike_lebron_21_1781112553741.png"
                alt="Nike Hoops Feature"
                className="max-h-56 object-contain transform -rotate-12 animate-pulse hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 flex flex-col items-center shadow-md">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-[10px] font-black uppercase text-white mt-1">Populares</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Shoe Finder Advisory Quiz Panel */}
        <AnimatePresence>
          {showQuiz && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 rounded-3xl border-2 border-orange-500/20 p-6 md:p-8 mb-12 shadow-lg relative overflow-hidden"
            >
              <button
                onClick={() => setShowQuiz(false)}
                className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-orange-500 animate-spin" />
                <h3 className="font-black uppercase tracking-tight text-lg">Sintonizador Nike Hoops</h3>
              </div>

              {!quizResult ? (
                <>
                  <p className="text-xs text-slate-400 mb-6 max-w-2xl">
                    Responda duas perguntas fundamentais de desempenho sobre seu jogo e deixe nosso algoritmo indicar exatamente qual tenis se alinha perfeitamente com seu estilo na quadra.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Q1: Focus */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/60">
                      <p className="text-xs font-black uppercase text-orange-400 mb-3">1. Qual seu papel e foco na quadra?</p>
                      <div className="space-y-2">
                        {[
                          { id: 'impacto', text: 'Combates físicos no garrafão (Preciso de apoio pesado e amortecimento)' },
                          { id: 'velocidade', text: 'Mudanças bruscas e velocidade pura de drible' },
                          { id: 'leveza', text: 'Controle de ritmo lateral, transições leves e arremessos' },
                          { id: 'parada', text: 'Versatilidade total e paradas em suspensão confiáveis' }
                        ].map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setQuizAnswers((p) => ({ ...p, focus: q.id }))}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                              quizAnswers.focus === q.id
                                ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{q.text}</span>
                            {quizAnswers.focus === q.id && <Check className="h-4 w-4 text-orange-500" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2: Preference */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/60">
                      <p className="text-xs font-black uppercase text-orange-400 mb-3">2. Qual a sensação de calçado favorita?</p>
                      <div className="space-y-2">
                        {[
                          { id: 'macio', text: 'Estilo "andar nas nuvens" (Máximo conforto interno no calcanhar)' },
                          { id: 'chao', text: 'Quero "sentir a quadra" (Corte baixo e estabilidade plana de sola)' },
                          { id: 'responsivo', text: 'Efeito mola elástica (Desejo máxima impulsão vertical)' }
                        ].map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setQuizAnswers((p) => ({ ...p, feel: q.id }))}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                              quizAnswers.feel === q.id
                                ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{q.text}</span>
                            {quizAnswers.feel === q.id && <Check className="h-4 w-4 text-orange-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        if (!quizAnswers.focus || !quizAnswers.feel) {
                          triggerToast('Por favor, responda as duas perguntas antes de sintonizar!');
                          return;
                        }
                        runQuizRecommendation(quizAnswers.focus, quizAnswers.feel);
                      }}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs uppercase font-extrabold tracking-wider cursor-pointer"
                    >
                      Sintonizar Meu Tênis
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-6 py-4">
                  <div className="h-44 w-44 bg-slate-950 rounded-2xl p-4 flex items-center justify-center border border-slate-800 shrink-0">
                    <img
                      src={quizResult.imageUrl}
                      alt={quizResult.name}
                      className="h-full w-full object-contain transform -rotate-12"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 text-left">
                    <span className="text-[10px] bg-green-500/20 text-green-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                      ✓ Combinação 98% Perfeita Encontrada
                    </span>
                    <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-1">
                      {quizResult.name}
                    </h4>
                    <p className="text-xs text-orange-400 font-semibold mb-2">{quizResult.tag}</p>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      Com base nas suas respostas, indicamos o modelo assinado por {quizResult.athlete}. Ele traz o amortecimento focado em {quizResult.techSpecs.cushioningType} e obteve {quizResult.metrics.responsiveness}% no quesito de impulsão/responsividade de testes práticos.
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedProduct(quizResult)}
                        className="px-5 py-2 bg-white hover:bg-slate-100 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow"
                      >
                        Ver Detalhes do Modelo
                      </button>
                      <button
                        onClick={handleRestartQuiz}
                        className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3 animate-spin" /> Responder Novamente
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Filters Section Header */}
        <section id="vitrine" className="scroll-mt-24 border-t border-slate-900 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                Vitrine De Quadra
              </h2>
              <p className="text-xs text-slate-400 mt-1">Filtre, pesquise e compare dezenas de métricas técnicas reais.</p>
            </div>

            {/* Filter controls panel */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Buscar por modelo ou atleta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 pl-9 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700 transition-colors"
                />
                <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
              </div>

              {/* Sorter Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-slate-700 cursor-pointer appearance-none pr-8"
                >
                  <option value="featured">Destaques Nike</option>
                  <option value="priceAsc">Preço: Menor ao Maior</option>
                  <option value="priceDesc">Preço: Maior ao Menor</option>
                  <option value="popularity">Mais Técnico / Avaliado</option>
                </select>
                <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Athlete & Category Badges strip */}
          <div className="flex flex-wrap gap-2.5 mt-5">
            {/* Category Selectors */}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center self-center mr-1">
              Estilo:
            </span>
            {['All', 'Power', 'Speed', 'Control', 'Agility'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold border cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-600/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'Todos os Estilos' : cat}
              </button>
            ))}

            <div className="h-6 w-px bg-slate-800 mx-2 hidden sm:block self-center" />

            {/* Athlete Selectors */}
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center self-center mr-1">
              Atleta:
            </span>
            {['All', 'LeBron James', 'Kevin Durant', 'Ja Morant', 'Sabrina Ionescu'].map((ath) => (
              <button
                key={ath}
                onClick={() => setSelectedAthlete(ath)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold border cursor-pointer transition-all ${
                  selectedAthlete === ath
                    ? 'bg-white border-white text-slate-950'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {ath === 'All' ? 'Todos os Atletas' : ath}
              </button>
            ))}
          </div>
        </section>

        {/* Product Cards Grid Layout */}
        <section className="mt-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
              <Compass className="h-12 w-12 text-slate-600 mx-auto animate-spin mb-3" />
              <h4 className="font-bold text-slate-300">Nenhum tênis encontrado</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Nenhum modelo coincide com os filtros aplicados. Altere seu termo de busca ou selecione outro atleta.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedAthlete('All');
                }}
                className="mt-4 text-xs font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
              >
                Resetar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((shoe) => {
                const isLiked = likedShoes.includes(shoe.id);
                const isComparing = compareIds.includes(shoe.id);

                return (
                  <motion.div
                    key={shoe.id}
                    layoutId={`shoe-card-${shoe.id}`}
                    className="group bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 hover:shadow-2xl transition-all duration-300 relative"
                  >
                    {/* Top Pill Tags & Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md ${
                        shoe.category === 'Power' ? 'bg-indigo-500/20 text-indigo-300' :
                        shoe.category === 'Speed' ? 'bg-red-500/20 text-red-300' :
                        shoe.category === 'Control' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-pink-500/20 text-pink-300'
                      }`}>
                        Estilo {shoe.category}
                      </span>

                      {/* Wishlist toggle */}
                      <button
                        onClick={() => toggleLike(shoe.id)}
                        className={`p-1.5 rounded-full border cursor-pointer transition-all ${
                          isLiked
                            ? 'bg-rose-500/20 border-rose-500/30 text-rose-500'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                        }`}
                        title="Favoritar"
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Shoe product Image frame */}
                    <div
                      onClick={() => setSelectedProduct(shoe)}
                      className="h-44 flex items-center justify-center relative cursor-pointer overflow-hidden p-2 rounded-2xl bg-slate-950/40 border border-slate-800/40 mb-4"
                    >
                      <img
                        src={shoe.imageUrl}
                        alt={shoe.name}
                        className="max-h-36 object-contain transform -rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-slate-950 tracking-wider text-[10px] font-black uppercase py-1.5 px-3 rounded-lg shadow-lg pointer-events-none transition-opacity">
                          Mais Informações
                        </span>
                      </div>
                    </div>

                    {/* Shoe metadata & tech specifications brief */}
                    <div>
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-0.5">
                        {shoe.athlete}
                      </span>
                      <h3
                        onClick={() => setSelectedProduct(shoe)}
                        className="font-extrabold text-sm md:text-base text-white hover:text-orange-400 transition-colors uppercase tracking-tight cursor-pointer truncate"
                      >
                        {shoe.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-normal line-clamp-2 h-8">
                        {shoe.description}
                      </p>

                      {/* Mini Key Metrics visual strip */}
                      <div className="my-3 py-2 border-y border-slate-800/60 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                        <div>
                          <div className="flex justify-between mb-0.5 font-medium">
                            <span>Tração</span>
                            <span className="font-bold text-white">{shoe.metrics.traction}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${shoe.metrics.traction}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-0.5 font-medium">
                            <span>Amortec.</span>
                            <span className="font-bold text-white">{shoe.metrics.cushioning}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full" style={{ width: `${shoe.metrics.cushioning}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Price / CTA Row */}
                    <div className="mt-3">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex flex-col">
                          {shoe.originalPrice && (
                            <span className="text-[10px] text-slate-500 line-through">
                              R$ {shoe.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          <span className="text-base font-black text-white">
                            R$ {shoe.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Sizer hint warning */}
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">
                          Cano {shoe.techSpecs.weightGrams > 400 ? 'Médio/Alto' : 'Baixo'}
                        </span>
                      </div>

                      {/* Control buttons */}
                      <div className="grid grid-cols-5 gap-2">
                        <button
                          onClick={() => setSelectedProduct(shoe)}
                          className="col-span-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer text-center"
                        >
                          Ver Detalhes
                        </button>

                        {/* Single-click Comparison toggle box */}
                        <button
                          onClick={() => handleToggleCompare(shoe.id)}
                          className={`col-span-2 py-2 flex items-center justify-center gap-1 border rounded-xl text-[9.5px] font-black uppercase cursor-pointer transition-all ${
                            isComparing
                              ? 'border-orange-500 bg-orange-500/10 text-orange-300'
                              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 hover:text-white'
                          }`}
                          title={isComparing ? 'Remover do comparador' : 'Adicionar ao comparador side-by-side'}
                        >
                          <ArrowLeftRight className="h-3 w-3" />
                          <span>{isComparing ? 'Sim' : 'Comp'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Technical Features Showcase / Brand Authority */}
        <section className="mt-20 border-t border-slate-900 pt-12 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              ✓ Compromisso De Desempenho Nike
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase text-white mt-4 tracking-tight">
              A FÓRMULA DOS CAMPEÕES
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xl mx-auto">
              Nossos tênis unem o amortecimento de impacto necessário para aguentar os rigores de uma temporada completa com a durabilidade que quadras externas e internas brasileiras exigem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: <Award className="h-6 w-6 text-orange-500" />,
                title: 'Assinatura Oficial',
                desc: 'Tênis criados em estreito desenvolvimento com atletas mundiais da NBA e WNBA, refinados nas quadras reais.'
              },
              {
                icon: <Shield className="h-6 w-6 text-orange-500" />,
                title: 'Durabilidade Certificada',
                desc: 'Compostos de borracha reforçados para alta longevidade tanto no parquete quanto no asfalto rústico da rua.'
              },
              {
                icon: <Sliders className="h-6 w-6 text-orange-500" />,
                title: 'Responsividade Tecnológica',
                desc: 'Sistemas funcionais de cápsulas Air Zoom e espumas premium elásticas proporcionando ganho vertical de salto.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-left">
                <div className="bg-slate-950 h-11 w-11 rounded-lg flex items-center justify-center mb-4 border border-slate-800">
                  {feature.icon}
                </div>
                <h4 className="font-extrabold text-sm md:text-base text-white uppercase">{feature.title}</h4>
                <p className="text-[11.5px] text-slate-400 mt-1.5 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Main Footer layout */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-black text-sm text-white uppercase tracking-wider block">NIKE HOOPS SHOWCASE</span>
            <span className="text-[10px] text-slate-500 mt-1 block">
              &copy; 2026 Nike Inc. Todos os direitos de performance reservados.
            </span>
          </div>

          <div className="flex gap-5 font-bold uppercase text-[11px] tracking-wider text-slate-500">
            <span className="hover:text-white transition-colors cursor-pointer">Segurança</span>
            <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contato Suporte</span>
          </div>
        </div>
      </footer>

      {/* Popups & Drawers Orchestration */}
      <AnimatePresence>
        {selectedProduct && (
          <ShoeModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={() => setCartItems([])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCompareOpen && (
          <ShoeComparison
            isOpen={isCompareOpen}
            onClose={() => setIsCompareOpen(false)}
            products={PRODUCTS}
            compareIds={compareIds}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCompare={handleAddToCompare}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
