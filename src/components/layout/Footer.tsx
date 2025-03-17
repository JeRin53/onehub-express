
import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Send,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-display font-semibold bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">
                ONEHUB
              </span>
            </Link>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Your all-in-one platform for daily essentials - food delivery, cab booking, hotel reservations, and more.
            </p>
            <div className="flex space-x-4 pt-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services/food-delivery" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Food Delivery
                </Link>
              </li>
              <li>
                <Link to="/services/cab-booking" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Cab Booking
                </Link>
              </li>
              <li>
                <Link to="/services/hotel-reservation" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Hotel Reservation
                </Link>
              </li>
              <li>
                <Link to="/services/fuel-delivery" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Fuel Delivery
                </Link>
              </li>
              <li>
                <Link to="/services/train-booking" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Train Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-orange-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-600">
                  123 Innovation Street, Tech City, CA 94043
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-orange-500 flex-shrink-0" size={18} />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-orange-500 flex-shrink-0" size={18} />
                <span className="text-gray-600">hello@onehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 pt-8 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 max-w-md">
              <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-600 text-sm">
                Get the latest updates, news and special offers sent directly to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 border border-gray-300 rounded-l-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 flex-grow min-w-0"
              />
              <button
                type="button"
                className="bg-orange-500 text-white px-4 py-2.5 rounded-r-lg hover:bg-orange-600 transition-colors duration-200 flex items-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ONEHUB. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-600 text-sm hover:text-orange-500 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-600 text-sm hover:text-orange-500 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-600 text-sm hover:text-orange-500 transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
