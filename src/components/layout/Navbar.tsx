
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import GeminiSearchBar from "@/components/search/GeminiSearchBar";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Fetch user profile data when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) {
            throw error;
          }
          
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("There was a problem signing out");
    }
  };

  // Updated navLinks to go to actual pages instead of hash links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
  ];

  const serviceLinks = [
    { name: "Food Delivery", path: "/services/food-delivery" },
    { name: "Cab Booking", path: "/services/cab-booking" },
    { name: "Hotel Reservations", path: "/services/hotel-reservation" },
    { name: "Fuel Delivery", path: "/services/fuel-delivery" },
    { name: "Train Booking", path: "/services/train-booking" },
  ];

  const isServicePage = location.pathname.startsWith('/services/');
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
        scrolled || isServicePage || isDashboard ? "bg-white shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-display font-semibold bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">
            ONEHUB
          </span>
        </Link>

        {/* Search bar - only show on service pages and dashboard */}
        {(isServicePage || isDashboard) && (
          <div className="hidden md:block max-w-md flex-1 mx-4">
            <GeminiSearchBar 
              serviceType="general" 
              placeholder="Search with Gemini AI..."
              className="w-full"
            />
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* Conditionally render Dashboard link if user is authenticated */}
          {user && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userData?.first_name || "User"} />
                    <AvatarFallback className="bg-orange-100 text-orange-800">
                      {userData?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData?.first_name} {userData?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Settings page would open here")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Support chat would open here")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 px-4 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="py-2 px-4 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center text-gray-600 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Search Bar - only show on service pages and dashboard */}
      {(isServicePage || isDashboard) && (
        <div className="md:hidden px-4 pb-2 pt-1">
          <GeminiSearchBar 
            serviceType="general" 
            placeholder="Search with Gemini AI..."
            className="w-full"
          />
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white/95 backdrop-blur-sm flex flex-col pt-24 px-6 md:hidden transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-lg font-medium text-gray-800 hover:text-orange-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {/* User is logged in - show dashboard and service links */}
          {user && (
            <>
              <Link
                to="/dashboard"
                className="text-lg font-medium text-gray-800 hover:text-orange-500 transition-colors"
              >
                Dashboard
              </Link>
              
              <div className="pt-2 border-t">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Services</h3>
                {serviceLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block py-2 text-base font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </>
          )}
          
          <div className="pt-6 flex flex-col space-y-4">
            {user ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={userData?.first_name || "User"} />
                    <AvatarFallback className="bg-orange-100 text-orange-800">
                      {userData?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {userData?.first_name} {userData?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Settings page would open here")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info("Support chat would open here")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Support
                </Button>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-3 text-center w-full border border-gray-300 rounded-md text-gray-800 font-medium hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="py-3 text-center w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
