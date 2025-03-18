
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Users, ShieldCheck, Sparkles } from "lucide-react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-violet-50 via-orange-50 to-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block bg-orange-100 text-orange-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                Our Story
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                About <span className="bg-gradient-to-r from-orange-500 via-violet-500 to-green-500 bg-clip-text text-transparent">ONEHUB</span>
              </h1>
              <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                We're on a mission to simplify your life by bringing all essential services together in one seamless platform.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission and Values */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block bg-violet-100 text-violet-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                  Our Mission
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Simplify everyday life through technology integration
                </h2>
                <p className="text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  ONEHUB was born from a simple observation: in today's digital world, we use dozens of apps for our daily needs. 
                  Our mission is to bring these services together, saving you time and reducing the complexity of modern life.
                </p>
                
                <div className="space-y-6">
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.3s" }}>
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Simplicity First</h3>
                      <p className="text-gray-600">
                        We believe technology should make life simpler, not more complicated. Everything we build follows this principle.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.4s" }}>
                    <Users className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Customer Obsessed</h3>
                      <p className="text-gray-600">
                        Every feature we develop starts with understanding our users' needs and pain points.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.5s" }}>
                    <ShieldCheck className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Trust and Security</h3>
                      <p className="text-gray-600">
                        We maintain the highest standards of data privacy and security to protect our users.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex animate-fade-in" style={{ animationDelay: "0.6s" }}>
                    <Sparkles className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Continuous Innovation</h3>
                      <p className="text-gray-600">
                        We constantly explore new technologies and partnerships to enhance our service offering.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "0.4s" }} />
                
                <div className="relative glass-card p-6 z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                    alt="ONEHUB Team" 
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block bg-green-100 text-green-600 font-medium text-sm px-3 py-1 rounded-full mb-5 animate-fade-in">
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Meet the people behind ONEHUB
              </h2>
              <p className="text-gray-600 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                We're a diverse team of developers, designers, and business professionals united by our passion for simplifying everyday life through technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Founder & CEO",
                  image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                  delay: 0.3
                },
                {
                  name: "Sarah Chen",
                  role: "CTO",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
                  delay: 0.4
                },
                {
                  name: "Michael Rodriguez",
                  role: "Lead Designer",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                  delay: 0.5
                },
                {
                  name: "Priya Sharma",
                  role: "Product Manager",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80",
                  delay: 0.6
                },
                {
                  name: "James Wilson",
                  role: "Head of Partnerships",
                  image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                  delay: 0.7
                },
                {
                  name: "Nina Patel",
                  role: "AI Research Lead",
                  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80",
                  delay: 0.8
                }
              ].map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in" 
                  style={{ animationDelay: `${member.delay}s` }}
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
