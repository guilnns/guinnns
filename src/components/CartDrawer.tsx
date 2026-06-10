import React, { useState } from 'react';
import { CartItem, OrderDetails, Product } from '../types';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, CheckCircle, Copy, Check, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, size: number, color: string, change: number) => void;
  onRemoveItem: (id: string, size: number, color: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState<OrderDetails>({
    fullName: '',
    email: '',
    zipCode: '',
    street: '',
    city: '',
    paymentMethod: 'pix',
    installments: 1
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [copiedPix, setCopiedPix] = useState(false);
  const [simulatedOrderCode, setSimulatedOrderCode] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal > 1000;
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 25.00;
  const total = subtotal + shippingCost;

  // Auto CEP simulation helper
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 8);
    setFormData((prev) => ({ ...prev, zipCode: val }));

    if (val.length === 8) {
      // Simulate slow API address lookup
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          street: 'Avenida Paulista, 1500 - Bela Vista',
          city: 'São Paulo - SP'
        }));
      }, 400);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Nome completo é obrigatório.';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'E-mail inválido.';
    if (formData.zipCode.length !== 8) errors.zipCode = 'CEP deve ter 8 dígitos.';
    if (!formData.street.trim()) errors.street = 'Endereço é obrigatório.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate placing order
    const randomCode = 'NK-' + Math.floor(100000 + Math.random() * 900000);
    setSimulatedOrderCode(randomCode);
    setStep('success');
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136nikehoops-checkout-payment-2026-610');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const resetFlow = () => {
    onClearCart();
    setStep('cart');
    setFormData({
      fullName: '',
      email: '',
      zipCode: '',
      street: '',
      city: '',
      paymentMethod: 'pix',
      installments: 1
    });
    setFormErrors({});
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-slate-800" />
            <span className="text-sm font-black uppercase tracking-widest text-slate-900">
              {step === 'cart' ? 'Seu Carrinho' : step === 'checkout' ? 'Finalizar Compra' : 'Compra Confirmada'}
            </span>
          </div>
          <button
            onClick={step === 'success' ? resetFlow : onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Steps Render */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Seu carrinho está vazio</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                    Você ainda não adicionou nenhum tênis Nike Hoops. Explore nossa seleção de basquete e monte seu kit!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors"
                  >
                    Voltar para Loja
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/60 relative group"
                    >
                      <div className="h-20 w-20 bg-white rounded-lg flex items-center justify-center p-1.5 border border-slate-100 shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-contain transform -rotate-6"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm truncate pr-4">
                          {item.product.name}
                        </h4>
                        <div className="flex gap-2.5 text-[11px] font-medium text-slate-500 mt-1">
                          <span>Tam BR: <strong className="text-slate-800">{item.selectedSize}</strong></span>
                          <span>Cor: <strong className="text-slate-800">{item.selectedColor}</strong></span>
                        </div>

                        {/* Price & Quantity Adjuster */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-black text-slate-900 text-sm">
                            R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>

                          <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)}
                              className="p-1 px-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)}
                              className="p-1 px-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}

                  {/* Free shipping dynamic bar */}
                  <div className="bg-slate-50 rounded-2xl p-4 mt-2 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-slate-800">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4 text-orange-500" />
                        <span>{isFreeShipping ? 'Frete Grátis Ativado!' : 'Progresso Frete Grátis'}</span>
                      </div>
                      {!isFreeShipping && (
                        <span>Faltam R$ {(1000 - subtotal).toFixed(2)}</span>
                      )}
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      Compras acima de <strong>R$ 1.000,00</strong> ganham Frete Expresso Grátis para todo o Brasil.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-800"
                  placeholder="Seu nome completo"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-1">
                  E-mail de Contato *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-800"
                  placeholder="exemplo@dominio.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-1">
                    CEP (Apenas Números) *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleZipCodeChange}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-800"
                    placeholder="00000000"
                    maxLength={8}
                  />
                  {formErrors.zipCode && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">{formErrors.zipCode}</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-1">
                    Cidade / UF
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    readOnly
                    className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none text-slate-500"
                    placeholder="Cidade preenchida via CEP"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-1">
                  Endereço de Entrega *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-800"
                  placeholder="Rua, número, complemento"
                />
                {formErrors.street && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">{formErrors.street}</p>
                )}
                {formData.zipCode.length === 8 && (
                  <span className="text-[10px] text-green-600 block mt-1 font-bold">✓ CEP Auto-Simulado com Sucesso</span>
                )}
              </div>

              {/* Payment Method selection */}
              <div>
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-2">
                  Método de Pagamento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pix', label: 'PIX (QRCoded)' },
                    { id: 'credit', label: 'Cartão' },
                    { id: 'boleto', label: 'Boleto' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: pm.id as any }))}
                      className={`py-2 px-1 rounded-xl border text-[11px] font-black uppercase text-center cursor-pointer transition-all ${
                        formData.paymentMethod === pm.id
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'credit' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-800 block mb-1">
                    Opções de Parcelamento
                  </label>
                  <select
                    name="installments"
                    value={formData.installments}
                    onChange={(e) => setFormData((prev) => ({ ...prev, installments: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    {Array.from({ length: 10 }).map((_, i) => {
                      const count = i + 1;
                      const valuePerInstallment = total / count;
                      return (
                        <option key={count} value={count}>
                          {count}x de R$ {valuePerInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {formData.paymentMethod === 'pix' && (
                <div className="bg-green-50 text-green-800 rounded-xl p-3 border border-green-100 text-xs">
                  <p className="font-bold">✓ 5% de Desconto Adicional no PIX</p>
                  <p className="text-[10px] text-green-600 mt-1">O código de pagamento PIX será fornecido na tela final de confirmação.</p>
                </div>
              )}
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
              <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Pedido Recebido!</h3>
              <p className="text-xs text-slate-600 mt-2">
                Obrigado, <strong className="text-slate-800">{formData.fullName}</strong>. Sua compra na Nike Basketball foi registrada com sucesso sob o protocolo:
              </p>
              <div className="my-4 px-4 py-2 bg-slate-100 rounded-lg text-slate-800 font-mono font-bold text-sm select-all">
                {simulatedOrderCode}
              </div>

              {formData.paymentMethod === 'pix' ? (
                <div className="w-full border border-green-100 rounded-2xl bg-green-50/50 p-4 mb-4 text-center">
                  <p className="text-xs font-bold text-green-800 block mb-3">Escaneie ou copie a chave PIX abaixo:</p>
                  <div className="h-32 w-32 bg-white mx-auto flex items-center justify-center p-2 rounded-xl mb-3 shadow-sm border border-slate-100">
                    {/* Simulated elegant PIX QR placeholder */}
                    <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-70">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`rounded-xs ${i % 3 === 0 || i % 7 === 0 ? 'bg-slate-900' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="mx-auto flex items-center gap-1.5 py-1.5 px-3 bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer transition-colors"
                  >
                    {copiedPix ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" /> Chave Copiada!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar Chave PIX
                      </>
                    )}
                  </button>
                </div>
              ) : formData.paymentMethod === 'credit' ? (
                <div className="w-full text-left bg-indigo-50 border border-indigo-100 text-indigo-900 p-4 rounded-xl text-xs space-y-1 mb-4">
                  <p className="font-bold flex items-center gap-1">
                    <CreditCard className="h-4 w-4" /> Pagamento Autenticado
                  </p>
                  <p className="text-[11px] text-indigo-700">Parcelas selecionadas: {formData.installments}x de R$ {(total / (formData.installments || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-indigo-500 mt-1">A cobrança será lançada sob o nome "NIKE*HOOPS-STORE".</p>
                </div>
              ) : (
                <div className="w-full text-left bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl text-xs space-y-1.5 mb-4">
                  <p className="font-bold">📄 Boleto Bancário Gerado</p>
                  <p className="text-[11px] text-slate-500">O PDF do boleto foi simulado e enviado para seu e-mail: {formData.email}</p>
                </div>
              )}

              <p className="text-[10px] text-slate-400 leading-normal mb-6">
                Todas as confirmações de envio e o código de rastreamento da transportadora serão enviados ao seu e-mail nas próximas horas.
              </p>

              <button
                onClick={resetFlow}
                className="w-full py-3 bg-black hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                Voltar ao Menu Inicial
              </button>
            </div>
          )}
        </div>

        {/* Drawer Summary Footer */}
        {cartItems.length > 0 && step !== 'success' && (
          <div className="border-t border-slate-100 p-6 bg-slate-50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} itens)</span>
                <span className="font-bold text-slate-900">
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Frete Expresso BR</span>
                <span className={`font-bold ${shippingCost === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                  {shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {formData.paymentMethod === 'pix' && step === 'checkout' && (
                <div className="flex justify-between text-xs text-green-600 font-medium">
                  <span>Desconto PIX (5%)</span>
                  <span>- R$ {(total * 0.05).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-base border-t border-slate-100 pt-2.5 font-black text-slate-900 uppercase">
                <span>Total Estimado</span>
                <span>
                  R$ {((formData.paymentMethod === 'pix' && step === 'checkout') ? total * 0.95 : total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 bg-black hover:bg-slate-900 text-white rounded-xl text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors shadow-lg shadow-black/10 text-center flex items-center justify-center gap-2"
              >
                Prosseguir para Entrega
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors"
                >
                  Voltar ao Carrinho
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutSubmit}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors shadow-md shadow-orange-600/10"
                >
                  Concluir Compra
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
