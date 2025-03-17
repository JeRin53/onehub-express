
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <span className="inline-block bg-orange-100 text-orange-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              All Essential Services In One Place
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Your Daily Essentials in{" "}
              <span className="bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">
                ONEHUB
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Find and book all your daily services in one app. From food delivery to cab booking, hotel reservations to train tickets - we've got you covered.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/dashboard" className="btn-primary flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/#services" className="btn-outline flex items-center justify-center">
                Explore Services
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">10K+</h4>
                <p className="text-gray-600">Daily Users</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">5+</h4>
                <p className="text-gray-600">Services</p>
              </div>
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900">99%</h4>
                <p className="text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Illustration */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.2s" }} />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.8s" }} />
              
              <div className="relative glass-card p-6 animate-scale-in" style={{ animationDelay: "0.6s" }}>
                <img 
                  src="https://images.unsplash.com/photo-1586880244406-556089db74d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" 
                  alt="ONEHUB Services" 
                  className="w-full h-auto rounded-xl object-cover shadow-md" 
                />
                
                {/* Floating badges */}
                <div className="absolute -top-5 -left-5 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
                  <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Food Delivery</p>
                    <p className="text-sm font-semibold">5 mins away</p>
                  </div>
                </div>
                
                <div className="absolute -bottom-5 -right-5 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1s" }}>
                  <div className="bg-violet-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cab Booking</p>
                    <p className="text-sm font-semibold">2 mins away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
