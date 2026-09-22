import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ title }) {
  const { currentUser, logout } = useAuth();
  const { toggleSidebar } = useUI();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-800 text-2xl leading-none shrink-0"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden md:block text-sm text-slate-500">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="hidden md:block h-6 w-px bg-slate-200" />
        <span className="hidden sm:inline text-sm font-medium text-slate-700">{currentUser?.name}</span>
        <span className="text-xs px-2 py-1 bg-accent-500/10 text-accent-600 rounded-full font-medium whitespace-nowrap">
          {currentUser?.role}
        </span>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="text-sm text-slate-500 hover:text-red-600 transition-colors whitespace-nowrap"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
