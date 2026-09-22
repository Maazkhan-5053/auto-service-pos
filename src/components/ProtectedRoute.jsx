import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ section, children }) {
  const { currentUser, can } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (section && !can(section)) {
    return (
      <div className="p-10 text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-slate-700">Access restricted</h2>
        <p className="text-slate-500 mt-1">Your role ({currentUser.role}) doesn't have access to this page.</p>
      </div>
    );
  }
  return children;
}
