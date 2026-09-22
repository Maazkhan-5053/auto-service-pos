import React, { useMemo } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { invoices, workOrders, inventory } = useData();
  const { mechanics } = useAuth();

  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const avgTicket = invoices.length ? totalRevenue / invoices.length : 0;

  const topItems = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => {
      inv.items.forEach((it) => {
        if (!map[it.name]) map[it.name] = { qty: 0, revenue: 0 };
        map[it.name].qty += it.qty;
        map[it.name].revenue += it.qty * it.price;
      });
    });
    return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 6);
  }, [invoices]);

  const mechanicStats = useMemo(() => {
    return mechanics.map((m) => {
      const jobs = workOrders.filter((w) => w.mechanicId === m.id);
      const completed = jobs.filter((w) => w.status === 'Completed' || w.status === 'Invoiced');
      return { name: m.name, total: jobs.length, completed: completed.length };
    });
  }, [mechanics, workOrders]);

  const inventoryValue = inventory.reduce((s, p) => s + p.cost * p.stock, 0);

  return (
    <div>
      <Header title="Reports" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} accent="text-emerald-600" />
          <StatCard label="Total Sales" value={invoices.length} />
          <StatCard label="Average Ticket" value={`$${avgTicket.toFixed(2)}`} />
          <StatCard label="Inventory Value (cost)" value={`$${inventoryValue.toFixed(2)}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-3 border-b border-slate-200 font-semibold text-slate-700">Top Selling Items/Services</div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {topItems.length === 0 && <div className="p-5 text-slate-400 text-sm">No sales data yet.</div>}
              {topItems.map(([name, stat]) => (
                <div key={name} className="p-4 flex justify-between text-sm">
                  <div>
                    <div className="font-medium text-slate-800">{name}</div>
                    <div className="text-xs text-slate-400">Qty sold: {stat.qty}</div>
                  </div>
                  <span className="font-semibold text-emerald-600">${stat.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-3 border-b border-slate-200 font-semibold text-slate-700">Mechanic Performance</div>
            <div className="divide-y max-h-80 overflow-y-auto">
              {mechanicStats.map((m) => (
                <div key={m.name} className="p-4 flex justify-between text-sm">
                  <span className="font-medium text-slate-800">{m.name}</span>
                  <span className="text-slate-500">{m.completed}/{m.total} jobs completed</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
