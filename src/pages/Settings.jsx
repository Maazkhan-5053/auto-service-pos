import React, { useState } from 'react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';

export default function Settings() {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateSettings({
      ...form,
      taxRate: Number(form.taxRate),
      laborRate: Number(form.laborRate),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <Header title="Settings" />
      <div className="p-6 max-w-lg">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Shop Name</label>
            <input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Tax Rate (e.g. 0.07 = 7%)</label>
              <input type="number" step="0.001" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Default Labor Rate ($/hr)</label>
              <input type="number" value={form.laborRate} onChange={(e) => setForm({ ...form, laborRate: e.target.value })} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Receipt Footer Message</label>
            <textarea value={form.receiptFooter} onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })} rows={2} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={save} className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2.5 rounded-lg font-medium">
            {saved ? 'Saved ✓' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
