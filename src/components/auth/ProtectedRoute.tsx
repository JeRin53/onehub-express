
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Add console logs to help debug the loading state
  useEffect(() => {
    console.log("ProtectedRoute: loading:", loading, "user:", user ? "exists" : "null");
  }, [loading, user]);
  
  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("ProtectedRoute: Loading timeout reached, forcing redirect");
        // We don't need to do anything here, just for debugging
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  if (loading) {
    // Limit loading time to avoid infinite loading
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }
  
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("ProtectedRoute: User authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
