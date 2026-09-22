import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';

export default function Vehicles() {
  const { vehicles, customers, addVehicle, updateVehicle, removeVehicle } = useData();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  const customerName = (id) => customers.find((c) => c.id === id)?.name || 'Unknown';

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.plate} ${v.vin}`.toLowerCase().includes(search.toLowerCase())
  );

  const save = (form) => {
    if (editing === 'new') addVehicle(form);
    else updateVehicle(editing.id, form);
    setEditing(null);
  };

  return (
    <div>
      <Header title="Vehicles" />
      <div className="p-6">
        <div className="flex justify-between mb-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search make, model, plate, VIN..." className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-72" />
          <button onClick={() => setEditing('new')} className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Vehicle</button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">VIN</th>
                <th className="px-4 py-3">Mileage</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{v.year} {v.make} {v.model}</td>
                  <td className="px-4 py-3 text-slate-600">{customerName(v.customerId)}</td>
                  <td className="px-4 py-3 text-slate-600">{v.plate}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{v.vin}</td>
                  <td className="px-4 py-3 text-slate-600">{v.mileage?.toLocaleString()} mi</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => setEditing(v)} className="text-accent-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => removeVehicle(v.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No vehicles found.</td></tr>}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {editing && (
        <VehicleModal vehicle={editing === 'new' ? null : editing} customers={customers} onClose={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function VehicleModal({ vehicle, customers, onClose, onSave }) {
  const [form, setForm] = useState(vehicle || { customerId: '', make: '', model: '', year: '', vin: '', plate: '', mileage: '' });
  return (
    <Modal title={vehicle ? 'Edit Vehicle' : 'Add Vehicle'} onClose={onClose}>
      <div className="space-y-3">
        <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Select owner *</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Plate" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <input placeholder="VIN" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Mileage" type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <button onClick={() => onSave(form)} className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2.5 rounded-lg font-medium">Save</button>
      </div>
    </Modal>
  );
}
