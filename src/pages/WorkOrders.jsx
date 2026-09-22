import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Invoiced: 'bg-slate-200 text-slate-600',
};

export default function WorkOrders() {
  const { workOrders, customers, vehicles, inventory, addWorkOrder, updateWorkOrder, createInvoice, settings } = useData();
  const { currentUser, mechanics, can } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const isMechanic = currentUser.role === 'Mechanic';
  const visibleOrders = isMechanic
    ? workOrders.filter((w) => w.mechanicId === currentUser.id)
    : workOrders;

  const customerName = (id) => customers.find((c) => c.id === id)?.name || 'Unknown';
  const vehicleLabel = (id) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? `${v.year} ${v.make} ${v.model}` : '—';
  };
  const mechanicName = (id) => mechanics.find((m) => m.id === id)?.name || 'Unassigned';

  const active = workOrders.find((w) => w.id === activeId);

  return (
    <div>
      <Header title="Work Orders" />
      <div className="p-6">
        {!isMechanic && (
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowNew(true)} className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              + New Work Order
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer / Vehicle</th>
                <th className="px-4 py-3">Complaint</th>
                <th className="px-4 py-3">Mechanic</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleOrders.slice().reverse().map((w) => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{w.id.toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800">{customerName(w.customerId)}</div>
                    <div className="text-xs text-slate-400">{vehicleLabel(w.vehicleId)}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{w.complaint}</td>
                  <td className="px-4 py-3 text-slate-600">{mechanicName(w.mechanicId)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[w.status]}`}>{w.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setActiveId(w.id)} className="text-accent-600 hover:underline text-xs font-medium">Open</button>
                  </td>
                </tr>
              ))}
              {visibleOrders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No work orders.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {showNew && (
        <NewWorkOrderModal
          onClose={() => setShowNew(false)}
          customers={customers}
          vehicles={vehicles}
          mechanics={mechanics}
          onCreate={(wo) => { addWorkOrder(wo); setShowNew(false); }}
        />
      )}

      {active && (
        <WorkOrderDetailModal
          wo={active}
          onClose={() => setActiveId(null)}
          customers={customers}
          vehicles={vehicles}
          mechanics={mechanics}
          inventory={inventory}
          settings={settings}
          canEditAssignment={!isMechanic}
          onUpdate={(patch) => updateWorkOrder(active.id, patch)}
          onInvoice={() => {
            const items = [
              ...active.parts.map((p) => {
                const part = inventory.find((i) => i.id === p.partId);
                return { type: 'part', refId: p.partId, name: part?.name || 'Part', qty: p.qty, price: p.price };
              }),
              ...active.labor.map((l) => ({ type: 'labor', refId: null, name: l.description, qty: l.hours, price: l.rate, isLabor: true })),
            ];
            createInvoice({
              customerId: active.customerId,
              vehicleId: active.vehicleId,
              workOrderId: active.id,
              items,
              discount: 0,
              paymentMethod: 'Cash',
              cashierId: currentUser.id,
            });
            setActiveId(null);
          }}
        />
      )}
    </div>
  );
}

function NewWorkOrderModal({ onClose, customers, vehicles, mechanics, onCreate }) {
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [complaint, setComplaint] = useState('');
  const custVehicles = vehicles.filter((v) => v.customerId === customerId);

  const submit = () => {
    if (!customerId || !complaint) return;
    onCreate({ customerId, vehicleId, mechanicId, complaint, status: 'Open', parts: [], labor: [], notes: '' });
  };

  return (
    <Modal title="New Work Order" onClose={onClose}>
      <div className="space-y-3">
        <select value={customerId} onChange={(e) => { setCustomerId(e.target.value); setVehicleId(''); }} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Select customer *</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" disabled={!customerId}>
          <option value="">Select vehicle</option>
          {custVehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
        </select>
        <select value={mechanicId} onChange={(e) => setMechanicId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Assign mechanic</option>
          {mechanics.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Customer complaint / reason for visit *" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" rows={3} />
        <button onClick={submit} className="w-full bg-accent-500 hover:bg-accent-600 text-white py-2.5 rounded-lg font-medium">Create Work Order</button>
      </div>
    </Modal>
  );
}

function WorkOrderDetailModal({ wo, onClose, customers, vehicles, mechanics, inventory, settings, canEditAssignment, onUpdate, onInvoice }) {
  const [status, setStatus] = useState(wo.status);
  const [mechanicId, setMechanicId] = useState(wo.mechanicId || '');
  const [notes, setNotes] = useState(wo.notes || '');
  const [selectedPart, setSelectedPart] = useState('');
  const [laborDesc, setLaborDesc] = useState('');
  const [laborHours, setLaborHours] = useState('');

  const customer = customers.find((c) => c.id === wo.customerId);
  const vehicle = vehicles.find((v) => v.id === wo.vehicleId);

  const partsTotal = wo.parts.reduce((s, p) => s + p.qty * p.price, 0);
  const laborTotal = wo.labor.reduce((s, l) => s + l.hours * l.rate, 0);
  const subtotal = partsTotal + laborTotal;
  const tax = subtotal * settings.taxRate;

  const saveStatus = () => onUpdate({ status, mechanicId, notes });

  const addPart = () => {
    const part = inventory.find((i) => i.id === selectedPart);
    if (!part) return;
    onUpdate({ parts: [...wo.parts, { partId: part.id, qty: 1, price: part.price }] });
    setSelectedPart('');
  };

  const addLabor = () => {
    if (!laborDesc || !laborHours) return;
    onUpdate({ labor: [...wo.labor, { description: laborDesc, hours: Number(laborHours), rate: settings.laborRate }] });
    setLaborDesc('');
    setLaborHours('');
  };

  return (
    <Modal title={`Work Order ${wo.id.toUpperCase()}`} onClose={onClose} wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm space-y-1 mb-4">
            <div><span className="text-slate-500">Customer:</span> <span className="font-medium">{customer?.name}</span></div>
            <div><span className="text-slate-500">Vehicle:</span> {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.plate})` : '—'}</div>
            <div><span className="text-slate-500">Complaint:</span> {wo.complaint}</div>
          </div>

          <div className="space-y-2 mb-4">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {['Open', 'In Progress', 'Completed', 'Invoiced'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {canEditAssignment && (
              <>
                <label className="text-xs font-medium text-slate-500">Mechanic</label>
                <select value={mechanicId} onChange={(e) => setMechanicId(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <option value="">Unassigned</option>
                  {mechanics.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </>
            )}
            <label className="text-xs font-medium text-slate-500">Technician Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            <button onClick={saveStatus} className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-medium">Save Changes</button>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-1">Parts Used</div>
            <div className="space-y-1 mb-2 max-h-28 overflow-y-auto">
              {wo.parts.map((p, i) => {
                const part = inventory.find((it) => it.id === p.partId);
                return <div key={i} className="flex justify-between text-sm"><span>{part?.name} x{p.qty}</span><span>${(p.qty * p.price).toFixed(2)}</span></div>;
              })}
            </div>
            <div className="flex gap-2">
              <select value={selectedPart} onChange={(e) => setSelectedPart(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs">
                <option value="">Add part...</option>
                {inventory.map((p) => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
              </select>
              <button onClick={addPart} className="bg-slate-100 hover:bg-slate-200 px-3 rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs font-medium text-slate-500 mb-1">Labor</div>
            <div className="space-y-1 mb-2 max-h-24 overflow-y-auto">
              {wo.labor.map((l, i) => (
                <div key={i} className="flex justify-between text-sm"><span>{l.description} ({l.hours}hr)</span><span>${(l.hours * l.rate).toFixed(2)}</span></div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={laborDesc} onChange={(e) => setLaborDesc(e.target.value)} placeholder="Description" className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-xs" />
              <input value={laborHours} onChange={(e) => setLaborHours(e.target.value)} placeholder="Hrs" type="number" className="w-16 border border-slate-300 rounded-lg px-2 py-1.5 text-xs" />
              <button onClick={addLabor} className="bg-slate-100 hover:bg-slate-200 px-3 rounded-lg text-xs font-medium">Add</button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>${(subtotal + tax).toFixed(2)}</span></div>
          </div>

          {canEditAssignment && wo.status !== 'Invoiced' && (
            <button onClick={onInvoice} className="w-full mt-3 bg-accent-500 hover:bg-accent-600 text-white py-2 rounded-lg text-sm font-medium">
              Convert to Invoice & Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
