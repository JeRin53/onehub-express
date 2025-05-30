
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FoodDelivery from "./pages/services/FoodDelivery";
import CabBooking from "./pages/services/CabBooking";
import HotelReservation from "./pages/services/HotelReservation";
import FuelDelivery from "./pages/services/FuelDelivery";
import TrainBooking from "./pages/services/TrainBooking";
import About from "./pages/About";
import Services from "./pages/Services";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Enhanced scroll to top component that always scrolls immediately to top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top first
    window.scrollTo(0, 0);
    
    // Then do a smoother scroll after a slight delay to ensure all content is loaded
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" closeButton={true} />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Update service routes to add console logging for debugging */}
            <Route path="/services/food-delivery" element={
              <ProtectedRoute>
                <FoodDelivery />
              </ProtectedRoute>
            } />
            
            <Route path="/services/cab-booking" element={
              <ProtectedRoute>
                <CabBooking />
              </ProtectedRoute>
            } />
            
            <Route path="/services/hotel-reservation" element={
              <ProtectedRoute>
                <HotelReservation />
              </ProtectedRoute>
            } />
            
            <Route path="/services/fuel-delivery" element={
              <ProtectedRoute>
                <FuelDelivery />
              </ProtectedRoute>
            } />
            
            <Route path="/services/train-booking" element={
              <ProtectedRoute>
                <TrainBooking />
              </ProtectedRoute>
            } />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
