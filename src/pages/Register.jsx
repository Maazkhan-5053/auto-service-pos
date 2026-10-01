import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'Admin', hint: 'Full access to every module' },
  { value: 'Manager', hint: 'Everything except Employees & Settings' },
  { value: 'Cashier', hint: 'POS, customers, vehicles, appointments, invoices' },
  { value: 'Mechanic', hint: 'Dashboard and work orders only' },
];

const inputCls =
  'mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '', role: 'Admin' });
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.password) {
      return setError('Please fill in all fields');
    }
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');

    const res = register(form);
    if (res.ok) navigate('/');
    else setError(res.error);
  };

  const selected = ROLES.find((r) => r.value === form.role);

  return (
    <div className="min-h-screen bg-garage-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛠️</div>
          <h1 className="text-2xl font-bold text-slate-800">Create an account</h1>
          <p className="text-slate-500 text-sm mt-1">Sign up to explore GearHead POS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Full name</label>
            <input value={form.name} onChange={set('name')} className={inputCls} placeholder="e.g. Jane Doe" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Username</label>
            <input value={form.username} onChange={set('username')} className={inputCls} placeholder="e.g. jane" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input type="password" value={form.password} onChange={set('password')} className={inputCls} placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Confirm password</label>
            <input type="password" value={form.confirm} onChange={set('confirm')} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Role</label>
            <select value={form.role} onChange={set('role')} className={inputCls}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.value}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">{selected.hint}</p>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
