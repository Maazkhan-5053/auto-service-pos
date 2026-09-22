import React, { createContext, useContext, useState, useEffect } from 'react';
import { seedUsers } from '../data/seedData';

const AuthContext = createContext(null);

const USERS_KEY = 'gearhead_users';
const SESSION_KEY = 'gearhead_session';

// Which nav sections / actions each role can access
export const ROLE_PERMISSIONS = {
  Admin: ['dashboard', 'pos', 'workorders', 'customers', 'vehicles', 'inventory', 'appointments', 'invoices', 'employees', 'reports', 'settings'],
  Manager: ['dashboard', 'pos', 'workorders', 'customers', 'vehicles', 'inventory', 'appointments', 'invoices', 'reports'],
  Cashier: ['dashboard', 'pos', 'customers', 'vehicles', 'appointments', 'invoices'],
  Mechanic: ['dashboard', 'workorders'],
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : seedUsers;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(SESSION_KEY);
  }, [currentUser]);

  const login = (username, password) => {
    const found = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid username or password' };
  };

  const logout = () => setCurrentUser(null);

  const can = (section) => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role]?.includes(section);
  };

  const addEmployee = (emp) => {
    setUsers((prev) => [...prev, { ...emp, id: 'u' + Date.now() }]);
  };

  const updateEmployee = (id, patch) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const removeEmployee = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const mechanics = users.filter((u) => u.role === 'Mechanic');

  return (
    <AuthContext.Provider
      value={{ currentUser, users, mechanics, login, logout, can, addEmployee, updateEmployee, removeEmployee }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
