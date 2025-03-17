
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: "orange" | "violet" | "green" | "blue" | "pink";
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  path,
  color,
  delay = 0
}) => {
  // Map for color styles
  const colorMap = {
    orange: {
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      hoverBorder: "group-hover:border-orange-300",
      chipBg: "bg-orange-500"
    },
    violet: {
      iconBg: "bg-violet-100",
      iconColor: "text-violet-500",
      hoverBorder: "group-hover:border-violet-300",
      chipBg: "bg-violet-500"
    },
    green: {
      iconBg: "bg-green-100",
      iconColor: "text-green-500",
      hoverBorder: "group-hover:border-green-300",
      chipBg: "bg-green-500"
    },
    blue: {
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      hoverBorder: "group-hover:border-blue-300",
      chipBg: "bg-blue-500"
    },
    pink: {
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
      hoverBorder: "group-hover:border-pink-300",
      chipBg: "bg-pink-500"
    }
  };

  const colors = colorMap[color];

  return (
    <div 
      className={cn(
        "group service-card animate-fade-in",
        { "opacity-0": true }
      )}
      style={{ 
        animationDelay: `${delay * 0.1}s`,
        animationFillMode: "forwards" 
      }}
    >
      <div className="flex flex-col h-full">
        <div className={cn("rounded-full w-14 h-14 flex items-center justify-center mb-5", colors.iconBg)}>
          <div className={colors.iconColor}>{icon}</div>
        </div>

        <div className="mb-1">
          <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full text-white", colors.chipBg)}>
            Popular service
          </span>
        </div>
        
        <h3 className="text-xl font-semibold mt-3 mb-2">{title}</h3>
        <p className="text-gray-600 mb-5 flex-grow">{description}</p>
        
        <Link 
          to={path} 
          className="inline-flex items-center text-gray-800 font-medium hover:text-orange-500 transition-colors"
        >
          Explore Service
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
