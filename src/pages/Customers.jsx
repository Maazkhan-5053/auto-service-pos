import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';

export default function Customers() {
  const { customers, vehicles, workOrders, addCustomer, updateCustomer, removeCustomer } = useData();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // customer object or 'new'
  const [viewing, setViewing] = useState(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const save = (form) => {
    if (editing === 'new') addCustomer(form);
    else updateCustomer(editing.id, form);
    setEditing(null);
  };

  return (
    <div>
      <Header title="Customers" />
      <div className="p-6">
        <div className="flex justify-between mb-4 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-72"
          />
          <button onClick={() => setEditing('new')} className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Add Customer
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vehicles</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600">{vehicles.filter((v) => v.customerId === c.id).length}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setViewing(c)} className="text-slate-500 hover:underline text-xs">History</button>
                    <button onClick={() => setEditing(c)} className="text-accent-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => removeCustomer(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {editing && (
        <CustomerModal
          customer={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      {viewing && (
        <Modal title={`${viewing.name} — Service History`} onClose={() => setViewing(null)} wide>
          <div className="space-y-2">
            {workOrders.filter((w) => w.customerId === viewing.id).length === 0 && (
              <div className="text-slate-400 text-sm">No service history yet.</div>
            )}
            {workOrders.filter((w) => w.customerId === viewing.id).map((w) => (
              <div key={w.id} className="border border-slate-200 rounded-lg p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{w.id.toUpperCase()}</span>
                  <span className="text-xs text-slate-400">{new Date(w.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-slate-600">{w.complaint}</div>
                <div className="text-xs text-slate-400">Status: {w.status}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(customer || { name: '', phone: '', email: '', address: '' });
  return (
    <Modal title={customer ? 'Edit Customer' : 'Add Customer'} onClose={onClose}>
      <div className="space-y-3">
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <button onClick={() => onSave(form)} className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2.5 rounded-lg font-medium">Save</button>
      </div>
    </Modal>
  );
}
