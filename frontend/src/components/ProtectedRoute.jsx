import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component redirects unauthenticated users to the login page
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If auth state is still loading from local storage, show a centered spinner
  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-50">
        <div class="flex flex-col items-center gap-3">
          <div class="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-slate-500">Authenticating session...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child components
  return children;
};

export default ProtectedRoute;
