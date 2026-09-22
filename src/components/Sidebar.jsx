import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const NAV_ITEMS = [
  { key: 'dashboard', to: '/', label: 'Dashboard', icon: '📊' },
  { key: 'pos', to: '/pos', label: 'POS Checkout', icon: '🧾' },
  { key: 'workorders', to: '/work-orders', label: 'Work Orders', icon: '🔧' },
  { key: 'appointments', to: '/appointments', label: 'Appointments', icon: '📅' },
  { key: 'customers', to: '/customers', label: 'Customers', icon: '👤' },
  { key: 'vehicles', to: '/vehicles', label: 'Vehicles', icon: '🚗' },
  { key: 'inventory', to: '/inventory', label: 'Inventory', icon: '📦' },
  { key: 'invoices', to: '/invoices', label: 'Invoices', icon: '💵' },
  { key: 'reports', to: '/reports', label: 'Reports', icon: '📈' },
  { key: 'employees', to: '/employees', label: 'Employees', icon: '🧑‍🔧' },
  { key: 'settings', to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const { currentUser, can } = useAuth();
  const { sidebarOpen, closeSidebar } = useUI();
  if (!currentUser) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 shrink-0 bg-garage-900 text-slate-200 flex flex-col z-40
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-5 py-5 border-b border-slate-700 flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>🛠️</span> GearHead POS
            </div>
            <div className="text-xs text-slate-400 mt-1">Auto Repair Shop System</div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white text-xl leading-none">
            &times;
          </button>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.filter((item) => can(item.key)).map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === '/'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent-600 text-white font-medium'
                    : 'text-slate-300 hover:bg-garage-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700 text-xs text-slate-400">
          Logged in as<br />
          <span className="text-slate-200 font-medium">{currentUser.name}</span> · {currentUser.role}
        </div>
      </aside>
    </>
  );
}
