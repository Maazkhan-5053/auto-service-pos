import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';

export default function Inventory() {
  const { inventory, addPart, updatePart, removePart } = useData();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [lowOnly, setLowOnly] = useState(false);

  let filtered = inventory.filter((p) =>
    `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  );
  if (lowOnly) filtered = filtered.filter((p) => p.stock <= p.reorderLevel);

  const save = (form) => {
    if (editing === 'new') addPart({ ...form, cost: Number(form.cost), price: Number(form.price), stock: Number(form.stock), reorderLevel: Number(form.reorderLevel) });
    else updatePart(editing.id, { ...form, cost: Number(form.cost), price: Number(form.price), stock: Number(form.stock), reorderLevel: Number(form.reorderLevel) });
    setEditing(null);
  };

  return (
    <div>
      <Header title="Inventory" />
      <div className="p-6">
        <div className="flex justify-between mb-4 gap-3 flex-wrap">
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search parts..." className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-64" />
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Low stock only
            </label>
          </div>
          <button onClick={() => setEditing('new')} className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Part</button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Part</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">${p.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock <= p.reorderLevel ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.supplier}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setEditing(p)} className="text-accent-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => removePart(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No parts found.</td></tr>}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {editing && <PartModal part={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function PartModal({ part, onClose, onSave }) {
  const [form, setForm] = useState(part || { sku: '', name: '', category: '', cost: '', price: '', stock: '', reorderLevel: '', supplier: '' });
  return (
    <Modal title={part ? 'Edit Part' : 'Add Part'} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <input placeholder="Part name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Cost" type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Sale price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Stock qty" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Reorder level" type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <input placeholder="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <button onClick={() => onSave(form)} className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2.5 rounded-lg font-medium">Save</button>
      </div>
    </Modal>
  );
}
