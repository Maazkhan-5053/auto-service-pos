import React, { useState, useMemo, useRef } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function POS() {
  const { inventory, services, customers, vehicles, createInvoice, settings } = useData();
  const { currentUser } = useAuth();

  const [cart, setCart] = useState([]); // {type, refId, name, qty, price}
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('parts'); // parts | labor
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [cashGiven, setCashGiven] = useState('');
  const [lastInvoice, setLastInvoice] = useState(null);
  const printRef = useRef();

  const filteredParts = inventory.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );
  const filteredServices = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const custVehicles = vehicles.filter((v) => v.customerId === customerId);

  const addPartToCart = (part) => {
    setCart((prev) => {
      const existing = prev.find((it) => it.type === 'part' && it.refId === part.id);
      if (existing) {
        return prev.map((it) => (it === existing ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { type: 'part', refId: part.id, name: part.name, qty: 1, price: part.price, maxStock: part.stock }];
    });
  };

  const addServiceToCart = (svc) => {
    setCart((prev) => [
      ...prev,
      { type: 'labor', refId: svc.id, name: svc.name, qty: svc.laborHours, price: svc.laborRate, isLabor: true },
    ]);
  };

  const updateQty = (idx, qty) => {
    setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, qty: Math.max(0.1, qty) } : it)));
  };
  const removeItem = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));

  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.qty * it.price, 0), [cart]);
  const discountedSubtotal = Math.max(0, subtotal - Number(discount || 0));
  const tax = discountedSubtotal * settings.taxRate;
  const total = discountedSubtotal + tax;
  const change = paymentMethod === 'Cash' && cashGiven ? Math.max(0, Number(cashGiven) - total) : 0;

  const canCheckout = cart.length > 0 && customerId && (paymentMethod !== 'Cash' || Number(cashGiven || 0) >= total);

  const handleCheckout = () => {
    if (!canCheckout) return;
    const invoice = createInvoice({
      customerId,
      vehicleId: vehicleId || null,
      items: cart.map(({ type, refId, name, qty, price }) => ({ type, refId, name, qty, price })),
      discount: Number(discount || 0),
      paymentMethod,
      amountPaid: paymentMethod === 'Cash' ? Number(cashGiven) : total,
      cashierId: currentUser.id,
    });
    setLastInvoice(invoice);
    setCart([]);
    setDiscount(0);
    setCashGiven('');
  };

  const handlePrint = () => {
    window.print();
  };

  const newSale = () => {
    setLastInvoice(null);
    setCustomerId('');
    setVehicleId('');
  };

  if (lastInvoice) {
    const cust = customers.find((c) => c.id === lastInvoice.customerId);
    return (
      <div>
        <Header title="Sale Complete" />
        <div className="p-6 flex flex-col items-center">
          <div id="print-area" ref={printRef} className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-sm">
            <div className="text-center mb-4">
              <div className="font-bold text-lg">{settings.shopName}</div>
              <div className="text-xs text-slate-500">{settings.address}</div>
              <div className="text-xs text-slate-500">{settings.phone}</div>
            </div>
            <div className="text-xs text-slate-500 mb-2">
              Invoice: {lastInvoice.id}<br />
              Date: {new Date(lastInvoice.createdAt).toLocaleString()}<br />
              Customer: {cust?.name}
            </div>
            <div className="border-t border-dashed border-slate-300 my-2" />
            {lastInvoice.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm py-0.5">
                <span>{it.name} {it.isLabor ? `(${it.qty}hr)` : `x${it.qty}`}</span>
                <span>${(it.qty * it.price).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-dashed border-slate-300 my-2" />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>${lastInvoice.subtotal.toFixed(2)}</span></div>
            {lastInvoice.discount > 0 && <div className="flex justify-between text-sm"><span>Discount</span><span>-${lastInvoice.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-sm"><span>Tax</span><span>${lastInvoice.tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-base mt-1"><span>Total</span><span>${lastInvoice.total.toFixed(2)}</span></div>
            <div className="text-xs text-slate-500 mt-2">Paid via {lastInvoice.paymentMethod}</div>
            <div className="text-center text-xs text-slate-400 mt-4">{settings.receiptFooter}</div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Print Receipt</button>
            <button onClick={newSale} className="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm">New Sale</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="POS Checkout" />
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product/service browser */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex gap-2 mb-3">
            <button onClick={() => setTab('parts')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tab === 'parts' ? 'bg-accent-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Parts</button>
            <button onClick={() => setTab('labor')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tab === 'labor' ? 'bg-accent-500 text-white' : 'bg-slate-100 text-slate-600'}`}>Labor / Services</button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="ml-auto border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto">
            {tab === 'parts' && filteredParts.map((p) => (
              <button
                key={p.id}
                onClick={() => addPartToCart(p)}
                disabled={p.stock <= 0}
                className="text-left border border-slate-200 rounded-lg p-3 hover:border-accent-500 hover:shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-sm text-slate-800">{p.name}</div>
                <div className="text-xs text-slate-400">{p.sku}</div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-semibold text-accent-600">${p.price.toFixed(2)}</span>
                  <span className="text-xs text-slate-400">{p.stock} in stock</span>
                </div>
              </button>
            ))}
            {tab === 'labor' && filteredServices.map((s) => (
              <button
                key={s.id}
                onClick={() => addServiceToCart(s)}
                className="text-left border border-slate-200 rounded-lg p-3 hover:border-accent-500 hover:shadow-sm transition"
              >
                <div className="font-medium text-sm text-slate-800">{s.name}</div>
                <div className="text-xs text-slate-400">{s.laborHours} hr @ ${s.laborRate}/hr</div>
                <div className="font-semibold text-accent-600 mt-2">${(s.laborHours * s.laborRate).toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart / checkout */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
          <div className="space-y-2 mb-3">
            <select value={customerId} onChange={(e) => { setCustomerId(e.target.value); setVehicleId(''); }} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select customer *</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {customerId && (
              <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Vehicle (optional)</option>
                {custVehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
              </select>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 min-h-[160px] max-h-72">
            {cart.length === 0 && <div className="text-slate-400 text-sm text-center py-10">Cart is empty</div>}
            {cart.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
                <div className="flex-1">
                  <div className="text-slate-800">{it.name}</div>
                  <div className="text-xs text-slate-400">${it.price.toFixed(2)} {it.isLabor ? '/hr' : 'ea'}</div>
                </div>
                <input
                  type="number"
                  step={it.isLabor ? 0.1 : 1}
                  min={0.1}
                  value={it.qty}
                  onChange={(e) => updateQty(idx, Number(e.target.value))}
                  className="w-14 border border-slate-200 rounded px-1 py-1 text-center text-xs mx-2"
                />
                <span className="w-16 text-right font-medium">${(it.qty * it.price).toFixed(2)}</span>
                <button onClick={() => removeItem(idx)} className="ml-2 text-red-400 hover:text-red-600">&times;</button>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 mt-3 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Discount ($)</span>
              <input type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-20 border border-slate-200 rounded px-2 py-1 text-right text-xs" />
            </div>
            <div className="flex justify-between"><span className="text-slate-500">Tax ({(settings.taxRate * 100).toFixed(1)}%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold pt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {['Cash', 'Card', 'Split'].map((m) => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`py-1.5 rounded-lg text-xs font-medium border ${paymentMethod === m ? 'bg-accent-500 text-white border-accent-500' : 'border-slate-200 text-slate-600'}`}>{m}</button>
              ))}
            </div>
            {paymentMethod === 'Cash' && (
              <div>
                <input
                  type="number"
                  placeholder="Cash received"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
                {cashGiven && <div className="text-xs text-slate-500 mt-1">Change due: <span className="font-medium">${change.toFixed(2)}</span></div>}
              </div>
            )}
            <button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Complete Sale — ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
