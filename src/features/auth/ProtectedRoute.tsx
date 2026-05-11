import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: ReactNode;
}

export default function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  if (!isLoggedIn) {
    // If not logged in, redirect to the Landing Page
    return <Navigate to="/" replace />;
  }

  // If logged in, show the page
  return <>{children}</>;
}