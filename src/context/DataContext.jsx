import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  seedCustomers, seedVehicles, seedInventory, seedServices,
  seedWorkOrders, seedAppointments, seedInvoices, seedSettings,
} from '../data/seedData';

const DataContext = createContext(null);

function usePersistedState(key, seed) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : seed;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

export function DataProvider({ children }) {
  const [customers, setCustomers] = usePersistedState('gearhead_customers', seedCustomers);
  const [vehicles, setVehicles] = usePersistedState('gearhead_vehicles', seedVehicles);
  const [inventory, setInventory] = usePersistedState('gearhead_inventory', seedInventory);
  const [services, setServices] = usePersistedState('gearhead_services', seedServices);
  const [workOrders, setWorkOrders] = usePersistedState('gearhead_workorders', seedWorkOrders);
  const [appointments, setAppointments] = usePersistedState('gearhead_appointments', seedAppointments);
  const [invoices, setInvoices] = usePersistedState('gearhead_invoices', seedInvoices);
  const [settings, setSettings] = usePersistedState('gearhead_settings', seedSettings);

  // ---- Customers ----
  const addCustomer = (c) => {
    const nc = { ...c, id: 'c' + Date.now() };
    setCustomers((prev) => [...prev, nc]);
    return nc;
  };
  const updateCustomer = (id, patch) =>
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeCustomer = (id) => setCustomers((prev) => prev.filter((c) => c.id !== id));

  // ---- Vehicles ----
  const addVehicle = (v) => {
    const nv = { ...v, id: 'v' + Date.now() };
    setVehicles((prev) => [...prev, nv]);
    return nv;
  };
  const updateVehicle = (id, patch) =>
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  const removeVehicle = (id) => setVehicles((prev) => prev.filter((v) => v.id !== id));

  // ---- Inventory ----
  const addPart = (p) => {
    const np = { ...p, id: 'p' + Date.now() };
    setInventory((prev) => [...prev, np]);
    return np;
  };
  const updatePart = (id, patch) =>
    setInventory((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removePart = (id) => setInventory((prev) => prev.filter((p) => p.id !== id));
  const adjustStock = (id, delta) =>
    setInventory((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));

  // ---- Work Orders ----
  const addWorkOrder = (wo) => {
    const nwo = { ...wo, id: 'wo' + Date.now(), createdAt: new Date().toISOString(), status: wo.status || 'Open', parts: wo.parts || [], labor: wo.labor || [] };
    setWorkOrders((prev) => [...prev, nwo]);
    return nwo;
  };
  const updateWorkOrder = (id, patch) =>
    setWorkOrders((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const removeWorkOrder = (id) => setWorkOrders((prev) => prev.filter((w) => w.id !== id));

  // ---- Appointments ----
  const addAppointment = (a) => {
    const na = { ...a, id: 'a' + Date.now(), status: a.status || 'Scheduled' };
    setAppointments((prev) => [...prev, na]);
    return na;
  };
  const updateAppointment = (id, patch) =>
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const removeAppointment = (id) => setAppointments((prev) => prev.filter((a) => a.id !== id));

  // ---- Invoices / Sales ----
  // Creates an invoice from either a raw POS cart or a work order.
  // items: [{ type: 'part'|'labor', refId, name, qty, price }]
  const createInvoice = ({ customerId, vehicleId, workOrderId, items, discount = 0, paymentMethod, amountPaid, cashierId }) => {
    const subtotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
    const discounted = Math.max(0, subtotal - discount);
    const tax = discounted * settings.taxRate;
    const total = discounted + tax;

    // Deduct stock for part items
    items.forEach((it) => {
      if (it.type === 'part') adjustStock(it.refId, -it.qty);
    });

    const invoice = {
      id: 'INV-' + Date.now(),
      customerId,
      vehicleId: vehicleId || null,
      workOrderId: workOrderId || null,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      amountPaid: amountPaid ?? total,
      cashierId,
      createdAt: new Date().toISOString(),
      status: 'Paid',
    };
    setInvoices((prev) => [...prev, invoice]);

    if (workOrderId) {
      updateWorkOrder(workOrderId, { status: 'Invoiced', invoiceId: invoice.id });
    }
    return invoice;
  };

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  const value = {
    customers, addCustomer, updateCustomer, removeCustomer,
    vehicles, addVehicle, updateVehicle, removeVehicle,
    inventory, addPart, updatePart, removePart, adjustStock,
    services,
    workOrders, addWorkOrder, updateWorkOrder, removeWorkOrder,
    appointments, addAppointment, updateAppointment, removeAppointment,
    invoices, createInvoice,
    settings, updateSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
