
import React from "react";
import { Star } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  name, 
  role, 
  content, 
  image, 
  rating, 
  delay = 0 
}) => {
  return (
    <div 
      className="bg-white p-8 rounded-2xl shadow-card border border-gray-100 animate-fade-in"
      style={{ 
        animationDelay: `${delay * 0.1}s`,
        animationFillMode: "forwards",
        opacity: 0 
      }}
    >
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={18} 
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">"{content}"</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4" 
        />
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular User",
      content: "ONEHUB has completely changed how I manage my daily tasks. The food delivery is always on time, and the cab booking service is incredibly reliable.",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      delay: 0
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Traveler",
      content: "As someone who travels frequently for work, having all my travel needs in one app is a game-changer. The hotel booking feature has saved me hours of time.",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      rating: 4,
      delay: 1
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Foodie & Explorer",
      content: "The variety of restaurants available for delivery is impressive. I've discovered so many new places to eat thanks to ONEHUB's recommendations.",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 5,
      delay: 2
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Family Man",
      content: "Planning family trips used to be stressful until I found ONEHUB. Now I can book everything from transportation to accommodations in minutes.",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      rating: 5,
      delay: 3
    },
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-green-100 text-green-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            What our users are saying
          </h2>
          <p className="text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Don't just take our word for it. Here's what some of our satisfied users have to say about their experience with ONEHUB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              image={testimonial.image}
              rating={testimonial.rating}
              delay={testimonial.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
