import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Appointments() {
  const { appointments, customers, vehicles, addAppointment, updateAppointment, removeAppointment } = useData();
  const { mechanics } = useAuth();
  const [showNew, setShowNew] = useState(false);

  const customerName = (id) => customers.find((c) => c.id === id)?.name || 'Unknown';
  const vehicleLabel = (id) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? `${v.year} ${v.make} ${v.model}` : '—';
  };
  const mechanicName = (id) => mechanics.find((m) => m.id === id)?.name || 'Unassigned';

  const sorted = appointments.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div>
      <Header title="Appointments" />
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowNew(true)} className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ New Appointment</button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Date / Time</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Mechanic</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{a.date} {a.time}</td>
                  <td className="px-4 py-3 text-slate-600">{customerName(a.customerId)}</td>
                  <td className="px-4 py-3 text-slate-600">{vehicleLabel(a.vehicleId)}</td>
                  <td className="px-4 py-3 text-slate-600">{a.reason}</td>
                  <td className="px-4 py-3 text-slate-600">{mechanicName(a.mechanicId)}</td>
                  <td className="px-4 py-3">
                    <select value={a.status} onChange={(e) => updateAppointment(a.id, { status: e.target.value })} className="text-xs border border-slate-200 rounded-full px-2 py-1">
                      {['Scheduled', 'Checked In', 'Completed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeAppointment(a.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No appointments scheduled.</td></tr>}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {showNew && (
        <NewAppointmentModal
          customers={customers}
          vehicles={vehicles}
          mechanics={mechanics}
          onClose={() => setShowNew(false)}
          onCreate={(a) => { addAppointment(a); setShowNew(false); }}
        />
      )}
    </div>
  );
}

function NewAppointmentModal({ customers, vehicles, mechanics, onClose, onCreate }) {
  const [form, setForm] = useState({ customerId: '', vehicleId: '', date: '', time: '', mechanicId: '', reason: '' });
  const custVehicles = vehicles.filter((v) => v.customerId === form.customerId);

  const submit = () => {
    if (!form.customerId || !form.date || !form.time) return;
    onCreate(form);
  };

  return (
    <Modal title="New Appointment" onClose={onClose}>
      <div className="space-y-3">
        <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value, vehicleId: '' })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Select customer *</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Vehicle</option>
          {custVehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <select value={form.mechanicId} onChange={(e) => setForm({ ...form, mechanicId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Assign mechanic</option>
          {mechanics.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <textarea placeholder="Reason for visit" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows={2} />
        <button onClick={submit} className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2.5 rounded-lg font-medium">Book Appointment</button>
      </div>
    </Modal>
  );
}
