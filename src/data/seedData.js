// Initial demo data used to seed localStorage on first run.

export const seedUsers = [
  { id: 'u1', name: 'Amanda Reyes', username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 'u2', name: 'Carlos Mendez', username: 'manager', password: 'manager123', role: 'Manager' },
  { id: 'u3', name: 'Jenny Park', username: 'cashier', password: 'cashier123', role: 'Cashier' },
  { id: 'u4', name: 'Mike Douglas', username: 'mike', password: 'mech123', role: 'Mechanic' },
  { id: 'u5', name: 'Sam Osei', username: 'sam', password: 'mech123', role: 'Mechanic' },
];

export const seedCustomers = [
  { id: 'c1', name: 'David Thompson', phone: '555-0101', email: 'dthompson@email.com', address: '12 Maple St' },
  { id: 'c2', name: 'Priya Nair', phone: '555-0102', email: 'priya.n@email.com', address: '88 Oak Ave' },
  { id: 'c3', name: 'Robert Kim', phone: '555-0103', email: 'rkim@email.com', address: '4 Elm Ct' },
];

export const seedVehicles = [
  { id: 'v1', customerId: 'c1', make: 'Toyota', model: 'Camry', year: '2018', vin: '4T1BF1FK5JU123456', plate: 'ABC-1234', mileage: 68000 },
  { id: 'v2', customerId: 'c2', make: 'Honda', model: 'CR-V', year: '2021', vin: '2HKRW2H59MH123789', plate: 'XYZ-9087', mileage: 21000 },
  { id: 'v3', customerId: 'c3', make: 'Ford', model: 'F-150', year: '2016', vin: '1FTFW1EF0GFA12345', plate: 'TRK-5511', mileage: 102000 },
];

export const seedInventory = [
  { id: 'p1', sku: 'OIL-5W30', name: 'Synthetic Oil 5W-30 (qt)', category: 'Fluids', cost: 4.5, price: 9.99, stock: 48, reorderLevel: 10, supplier: 'AutoParts Direct' },
  { id: 'p2', sku: 'FLT-OIL01', name: 'Oil Filter - Standard', category: 'Filters', cost: 2.2, price: 7.5, stock: 30, reorderLevel: 8, supplier: 'AutoParts Direct' },
  { id: 'p3', sku: 'BRK-PADF', name: 'Front Brake Pads (set)', category: 'Brakes', cost: 22, price: 54.99, stock: 12, reorderLevel: 5, supplier: 'BrakeMasters' },
  { id: 'p4', sku: 'BRK-PADR', name: 'Rear Brake Pads (set)', category: 'Brakes', cost: 20, price: 49.99, stock: 3, reorderLevel: 5, supplier: 'BrakeMasters' },
  { id: 'p5', sku: 'BAT-12V', name: 'Car Battery 12V 650CCA', category: 'Electrical', cost: 65, price: 129.99, stock: 6, reorderLevel: 3, supplier: 'PowerCell Inc' },
  { id: 'p6', sku: 'TIRE-215', name: 'Tire 215/55R17', category: 'Tires', cost: 55, price: 119.99, stock: 16, reorderLevel: 4, supplier: 'TireWorld' },
  { id: 'p7', sku: 'WPR-BLD', name: 'Wiper Blade (pair)', category: 'Exterior', cost: 6, price: 18.99, stock: 20, reorderLevel: 6, supplier: 'AutoParts Direct' },
  { id: 'p8', sku: 'SPK-PLUG', name: 'Spark Plug (each)', category: 'Engine', cost: 3, price: 8.99, stock: 40, reorderLevel: 12, supplier: 'AutoParts Direct' },
];

export const seedServices = [
  { id: 's1', name: 'Oil Change (standard)', laborHours: 0.5, laborRate: 95 },
  { id: 's2', name: 'Brake Pad Replacement (per axle)', laborHours: 1.2, laborRate: 95 },
  { id: 's3', name: 'Battery Replacement', laborHours: 0.4, laborRate: 95 },
  { id: 's4', name: 'Tire Rotation', laborHours: 0.5, laborRate: 95 },
  { id: 's5', name: 'Tire Replacement (each)', laborHours: 0.3, laborRate: 95 },
  { id: 's6', name: 'General Inspection', laborHours: 0.75, laborRate: 95 },
  { id: 's7', name: 'Spark Plug Replacement', laborHours: 1.0, laborRate: 95 },
];

export const seedWorkOrders = [
  {
    id: 'wo1001',
    customerId: 'c1',
    vehicleId: 'v1',
    mechanicId: 'u4',
    status: 'In Progress',
    createdAt: '2026-09-18T09:00:00.000Z',
    complaint: 'Squeaking noise when braking',
    parts: [{ partId: 'p3', qty: 1, price: 54.99 }],
    labor: [{ description: 'Front Brake Pad Replacement', hours: 1.2, rate: 95 }],
    notes: 'Rotors look ok, no need to resurface.',
  },
  {
    id: 'wo1002',
    customerId: 'c2',
    vehicleId: 'v2',
    mechanicId: 'u5',
    status: 'Open',
    createdAt: '2026-09-20T13:30:00.000Z',
    complaint: 'Scheduled oil change + tire rotation',
    parts: [
      { partId: 'p1', qty: 5, price: 9.99 },
      { partId: 'p2', qty: 1, price: 7.5 },
    ],
    labor: [
      { description: 'Oil Change', hours: 0.5, rate: 95 },
      { description: 'Tire Rotation', hours: 0.5, rate: 95 },
    ],
    notes: '',
  },
];

export const seedAppointments = [
  { id: 'a1', customerId: 'c3', vehicleId: 'v3', date: '2026-09-23', time: '10:00', mechanicId: 'u4', reason: 'Battery check - won\'t start reliably', status: 'Scheduled' },
  { id: 'a2', customerId: 'c1', vehicleId: 'v1', date: '2026-09-24', time: '14:00', mechanicId: 'u5', reason: 'Follow-up brake inspection', status: 'Scheduled' },
];

export const seedInvoices = [];

export const seedSettings = {
  shopName: 'GearHead Auto Repair',
  address: '221 Torque Lane, Peshawar',
  phone: '555-0100',
  taxRate: 0.07,
  laborRate: 95,
  receiptFooter: 'Thank you for trusting us with your vehicle!',
};
