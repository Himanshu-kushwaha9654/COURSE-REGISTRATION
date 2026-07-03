import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user has wrong role, redirect to appropriate home
    return <Navigate to={role === 'ADMIN' ? '/dashboard/admin' : '/dashboard'} replace />;
  }

  return children;
}
