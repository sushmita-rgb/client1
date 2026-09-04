import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading, checked, ensureChecked } = useAuth();

  // The session is resolved on demand; this is the only public entry point to it.
  useEffect(() => { ensureChecked(); }, [ensureChecked]);

  if (!checked || loading) {
    return (
      <div className="py-24 bg-[#FAF7F2] min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#B8D4F0] border-t-[#4A607A] rounded-full animate-spin mx-auto" />
          <p className="font-serif text-[#5C728A] text-sm">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-screen flex items-center justify-center text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-rose-200 max-w-md shadow-soft space-y-4">
          <h2 className="font-serif text-2xl text-rose-700">Access Restricted</h2>
          <p className="text-sm text-[#5C728A]">
            The owner admin dashboard is restricted to authorized administrative accounts.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}
