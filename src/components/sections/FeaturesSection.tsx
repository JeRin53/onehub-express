
import React from "react";
import { Utensils, Car, Hotel, Fuel, Train } from "lucide-react";
import ServiceCard from "@/components/ui/ServiceCard";

const FeaturesSection = () => {
  const services = [
    {
      id: 1,
      title: "Food Delivery",
      description: "Order food from your favorite restaurants and have it delivered to your doorstep in minutes.",
      icon: <Utensils size={24} />,
      path: "/services/food-delivery",
      color: "orange" as const,
      delay: 0
    },
    {
      id: 2,
      title: "Cab Booking",
      description: "Book a safe and reliable ride in seconds. Experienced drivers, fixed fares, no surprises.",
      icon: <Car size={24} />,
      path: "/services/cab-booking",
      color: "violet" as const,
      delay: 1
    },
    {
      id: 3,
      title: "Hotel Reservations",
      description: "Find and book the perfect accommodation for your next trip, from luxury hotels to cozy stays.",
      icon: <Hotel size={24} />,
      path: "/services/hotel-reservation",
      color: "green" as const,
      delay: 2
    },
    {
      id: 4,
      title: "Fuel Delivery",
      description: "Never run out of fuel again. Get premium quality fuel delivered directly to your vehicle.",
      icon: <Fuel size={24} />,
      path: "/services/fuel-delivery",
      color: "blue" as const,
      delay: 3
    },
    {
      id: 5,
      title: "Train Ticket Booking",
      description: "Book train tickets hassle-free with real-time availability, seat selection, and instant confirmation.",
      icon: <Train size={24} />,
      path: "/services/train-booking",
      color: "pink" as const,
      delay: 4
    },
  ];

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-violet-100 text-violet-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Everything you need, all in one place
          </h2>
          <p className="text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Discover the convenience of having all your essential services accessible through a single platform, designed to make your life easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              path={service.path}
              color={service.color}
              delay={service.delay}
            />
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <a 
            href="/services"
            className="btn-secondary"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
