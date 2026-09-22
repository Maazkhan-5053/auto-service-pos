import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';

export default function Invoices() {
  const { invoices, customers, settings } = useData();
  const [viewing, setViewing] = useState(null);
  const customerName = (id) => customers.find((c) => c.id === id)?.name || 'Unknown';

  const sorted = invoices.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <Header title="Invoices" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Invoice #</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{inv.id}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(inv.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-600">{customerName(inv.customerId)}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">${inv.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{inv.paymentMethod}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">{inv.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setViewing(inv)} className="text-accent-600 hover:underline text-xs">View</button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No invoices yet.</td></tr>}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {viewing && (
        <Modal title={viewing.id} onClose={() => setViewing(null)}>
          <div className="text-sm space-y-2">
            <div className="text-slate-500">{customerName(viewing.customerId)} · {new Date(viewing.createdAt).toLocaleString()}</div>
            <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
              {viewing.items.map((it, i) => (
                <div key={i} className="flex justify-between"><span>{it.name} {it.isLabor ? `(${it.qty}hr)` : `x${it.qty}`}</span><span>${(it.qty * it.price).toFixed(2)}</span></div>
              ))}
            </div>
            <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>${viewing.subtotal.toFixed(2)}</span></div>
              {viewing.discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-${viewing.discount.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span>Tax</span><span>${viewing.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>${viewing.total.toFixed(2)}</span></div>
            </div>
            <div className="text-xs text-slate-400 pt-2">Paid via {viewing.paymentMethod} · {settings.shopName}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
