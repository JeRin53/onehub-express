
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import GeminiSearchBar from "@/components/search/GeminiSearchBar";

const HeroSection = () => {
  const [animatedLogos, setAnimatedLogos] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Start logo animation after component mounts
    const timer = setTimeout(() => {
      setAnimatedLogos(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleExploreServices = () => {
    navigate('/services');
  };

  // Popular services that will be shown floating and merging into ONEHUB
  const serviceLogos = [
    { name: "Swiggy", icon: "🍔", logo: "/logos/swiggy.png", color: "bg-orange-500", delay: 0 },
    { name: "Uber", icon: "🚕", logo: "/logos/uber.png", color: "bg-violet-500", delay: 0.3 },
    { name: "Booking.com", icon: "🏨", logo: "/logos/booking.png", color: "bg-green-500", delay: 0.6 },
    { name: "Amazon", icon: "🛍️", logo: "/logos/amazon.png", color: "bg-blue-500", delay: 0.9 },
    { name: "MakeMyTrip", icon: "🚆", logo: "/logos/makemytrip.png", color: "bg-pink-500", delay: 1.2 },
    { name: "FuelBuddy", icon: "⛽", logo: "/logos/fuelbuddy.png", color: "bg-yellow-500", delay: 1.5 },
    { name: "Zomato", icon: "🍕", logo: "/logos/zomato.png", color: "bg-red-500", delay: 1.8 },
    { name: "Flipkart", icon: "📦", logo: "/logos/flipkart.png", color: "bg-blue-400", delay: 2.1 },
  ];

  // Partner logos for display
  const partnerLogos = [
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/2560px-Swiggy_logo.svg.png", bg: "bg-white" },
    { name: "Zomato", logo: "https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png", bg: "bg-white" },
    { name: "Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png", bg: "bg-black" },
    { name: "Ola", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ola_Cabs_logo.svg/2560px-Ola_Cabs_logo.svg.png", bg: "bg-white" },
    { name: "MakeMyTrip", logo: "https://imgak.mmtcdn.com/pwa_v3/pwa_hotel_assets/header/mmtLogoWhite.png", bg: "bg-blue-500" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png", bg: "bg-white" },
  ];

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-orange-50 to-green-50 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
            
            {/* AI Search Bar */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-2xl">
                <GeminiSearchBar 
                  serviceType="general" 
                  placeholder="Try 'I want to order biriyani, fast and cheap'"
                  className="w-full"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Powered by Gemini AI - Just describe what you need in natural language</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Link to="/dashboard" className="btn-primary flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button 
                onClick={handleExploreServices} 
                className="btn-outline flex items-center justify-center"
              >
                Explore Services
                <ChevronRight className="ml-1 h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
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
            
            {/* Partner Logos Section */}
            <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <p className="text-sm font-medium text-gray-500 mb-3">TRUSTED BY LEADING BRANDS</p>
              <div className="flex flex-wrap items-center gap-4">
                {partnerLogos.map((partner, index) => (
                  <div 
                    key={index}
                    className={`${partner.bg === 'bg-white' ? 'bg-white' : partner.bg} p-2 rounded-md shadow-sm h-8 flex items-center justify-center`}
                    style={{ maxWidth: '90px' }}
                  >
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-full w-auto object-contain" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Integration Illustration */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-96 md:h-[500px]">
              {/* Floating glowing orbs in background */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.2s" }} />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.8s" }} />
              
              {/* ONEHUB center box */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-white rounded-xl shadow-xl flex items-center justify-center z-10 animate-pulse-soft">
                <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">ONEHUB</div>
              </div>
              
              {/* Floating service logos that move toward the center */}
              {serviceLogos.map((service, index) => (
                <div 
                  key={index}
                  className={`absolute ${service.color} w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex items-center justify-center text-2xl md:text-3xl z-0 transition-all duration-1000 ease-in-out ${
                    animatedLogos 
                      ? "opacity-0 scale-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                      : "opacity-100"
                  }`}
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${10 + Math.random() * 80}%`,
                    transitionDelay: `${service.delay + 1}s`,
                    transformOrigin: 'center',
                  }}
                >
                  <span role="img" aria-label={service.name}>{service.icon}</span>
                </div>
              ))}
              
              {/* Partner logos */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* App logos in orbit around ONEHUB */}
                  <div className="absolute top-5 left-5 bg-white p-2 rounded-lg shadow-md flex items-center animate-float" style={{ animationDelay: "0.7s" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Swiggy_logo.svg/2560px-Swiggy_logo.svg.png" alt="Swiggy" className="h-8 w-auto object-contain" />
                  </div>
                  <div className="absolute top-20 right-10 bg-white p-2 rounded-lg shadow-md flex items-center animate-float" style={{ animationDelay: "1.1s" }}>
                    <img src="https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png" alt="Zomato" className="h-8 w-auto object-contain" />
                  </div>
                  <div className="absolute bottom-10 left-10 bg-black p-2 rounded-lg shadow-md flex items-center animate-float" style={{ animationDelay: "1.5s" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="Uber" className="h-8 w-auto object-contain" />
                  </div>
                  <div className="absolute bottom-20 right-5 bg-white p-2 rounded-lg shadow-md flex items-center animate-float" style={{ animationDelay: "1.9s" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" alt="Amazon" className="h-8 w-auto object-contain" />
                  </div>
                  <div className="absolute top-1/3 left-1/4 bg-white p-2 rounded-lg shadow-md flex items-center animate-float" style={{ animationDelay: "2.3s" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ola_Cabs_logo.svg/2560px-Ola_Cabs_logo.svg.png" alt="Ola" className="h-8 w-auto object-contain" />
                  </div>
                </div>
              </div>
              
              {/* Service category labels */}
              <div className="absolute top-5 left-0 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "0.8s" }}>
                <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🍔
                </div>
                <div>
                  <p className="text-xs text-gray-500">Food Delivery</p>
                  <p className="text-sm font-semibold">5 mins away</p>
                </div>
              </div>
              
              <div className="absolute bottom-5 right-0 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1s" }}>
                <div className="bg-violet-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🚕
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cab Booking</p>
                  <p className="text-sm font-semibold">2 mins away</p>
                </div>
              </div>
              
              <div className="absolute top-1/4 right-10 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1.2s" }}>
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🏨
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hotel Booking</p>
                  <p className="text-sm font-semibold">Best deals</p>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 left-10 bg-white p-3 rounded-lg shadow-md flex items-center animate-fade-in" style={{ animationDelay: "1.4s" }}>
                <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white mr-3">
                  🛍️
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shopping</p>
                  <p className="text-sm font-semibold">60% off</p>
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
