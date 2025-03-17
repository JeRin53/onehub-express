
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services" },
    { name: "About", path: "/#about" },
    { name: "Testimonials", path: "/#testimonials" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
        scrolled ? "glass-nav" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-display font-semibold bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">
            ONEHUB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="nav-link"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="btn-outline py-2 px-4 text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="btn-primary py-2 px-4 text-sm"
          >
            Get Started
          </Link>
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
          <div className="pt-6 flex flex-col space-y-4">
            <Link
              to="/login"
              className="btn-outline w-full text-center"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="btn-primary w-full text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
