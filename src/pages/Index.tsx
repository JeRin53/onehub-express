
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { ArrowRight, CheckCircle, Shield, Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        
        {/* Why Choose Us Section */}
        <section id="about" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block bg-orange-100 text-orange-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                  Why Choose Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Your convenience is our top priority
                </h2>
                <p className="text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  We've built ONEHUB with one goal in mind: to make your life easier by bringing all essential services together in a seamless, user-friendly experience.
                </p>
                
                <div className="space-y-6">
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">All Services in One App</h3>
                      <p className="text-gray-600">
                        No more juggling between multiple apps. Access all your daily services from a single platform.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <Shield className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Secure and Reliable</h3>
                      <p className="text-gray-600">
                        Your data and transactions are protected with bank-level security measures.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.5s" }}>
                    <Clock className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Save Time and Effort</h3>
                      <p className="text-gray-600">
                        What used to take hours now takes minutes. Quick booking, instant confirmations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.6s" }}>
                    <Zap className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Personalized Experience</h3>
                      <p className="text-gray-600">
                        Get recommendations tailored to your preferences and usage patterns.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 animate-fade-in" style={{ animationDelay: "0.7s" }}>
                  <Link to="/about" className="btn-outline flex items-center w-fit">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div className="relative animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.4s" }} />
                
                <div className="relative glass-card p-6 z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                    alt="ONEHUB Mobile App" 
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <TestimonialsSection />
        
        {/* CTA Section */}
        <section id="contact" className="py-24 bg-gradient-to-r from-violet-600 to-violet-800 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
              Ready to simplify your life?
            </h2>
            <p className="text-violet-100 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Join thousands of satisfied users who have made ONEHUB an essential part of their daily routine. Get started today and experience the convenience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/dashboard" className="bg-white text-violet-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-out">
                Get Started
              </Link>
              <Link to="/contact" className="border border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-full transition-all duration-300 ease-out">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
