import React from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { invoices, workOrders, inventory, appointments, customers } = useData();
  const { currentUser } = useAuth();

  const today = new Date().toISOString().slice(0, 10);
  const todaysInvoices = invoices.filter((i) => i.createdAt.slice(0, 10) === today);
  const todaysRevenue = todaysInvoices.reduce((s, i) => s + i.total, 0);
  const openWorkOrders = workOrders.filter((w) => w.status === 'Open' || w.status === 'In Progress');
  const lowStock = inventory.filter((p) => p.stock <= p.reorderLevel);
  const upcomingAppts = appointments.filter((a) => a.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  const myWorkOrders = currentUser.role === 'Mechanic'
    ? workOrders.filter((w) => w.mechanicId === currentUser.id && w.status !== 'Invoiced')
    : null;

  const customerName = (id) => customers.find((c) => c.id === id)?.name || 'Unknown';

  return (
    <div>
      <Header title={`Welcome back, ${currentUser.name.split(' ')[0]}`} />
      <div className="p-6 space-y-6">

        {myWorkOrders ? (
          <>
            <h2 className="font-semibold text-slate-700">Your Assigned Jobs</h2>
            <div className="bg-white rounded-xl border border-slate-200 divide-y">
              {myWorkOrders.length === 0 && <div className="p-5 text-slate-400 text-sm">No jobs assigned right now. 🎉</div>}
              {myWorkOrders.map((w) => (
                <div key={w.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-800">{w.id.toUpperCase()} — {customerName(w.customerId)}</div>
                    <div className="text-sm text-slate-500">{w.complaint}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    w.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>{w.status}</span>
                </div>
              ))}
            </div>
            <Link to="/work-orders" className="inline-block text-accent-600 text-sm font-medium hover:underline">
              Go to Work Orders →
            </Link>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Today's Revenue" value={`$${todaysRevenue.toFixed(2)}`} sub={`${todaysInvoices.length} sales today`} accent="text-emerald-600" />
              <StatCard label="Open Work Orders" value={openWorkOrders.length} sub="Open or in progress" />
              <StatCard label="Low Stock Items" value={lowStock.length} sub="At or below reorder level" accent={lowStock.length ? 'text-red-600' : 'text-slate-800'} />
              <StatCard label="Upcoming Appointments" value={upcomingAppts.length} sub="Scheduled from today" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-5 py-3 border-b border-slate-200 font-semibold text-slate-700">Open Work Orders</div>
                <div className="divide-y max-h-80 overflow-y-auto">
                  {openWorkOrders.length === 0 && <div className="p-5 text-slate-400 text-sm">No open work orders.</div>}
                  {openWorkOrders.map((w) => (
                    <div key={w.id} className="p-4 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium text-slate-800">{w.id.toUpperCase()} — {customerName(w.customerId)}</div>
                        <div className="text-slate-500">{w.complaint}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{w.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-5 py-3 border-b border-slate-200 font-semibold text-slate-700">Low Stock Alerts</div>
                <div className="divide-y max-h-80 overflow-y-auto">
                  {lowStock.length === 0 && <div className="p-5 text-slate-400 text-sm">All stock levels healthy.</div>}
                  {lowStock.map((p) => (
                    <div key={p.id} className="p-4 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium text-slate-800">{p.name}</div>
                        <div className="text-slate-500">{p.sku}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
