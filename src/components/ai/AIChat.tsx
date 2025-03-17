
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

interface AIChatProps {
  serviceType?: 'food-delivery' | 'cab-booking' | 'hotel-reservation' | 'fuel-delivery' | 'train-booking' | 'general';
  title?: string;
  className?: string;
}

const AIChat: React.FC<AIChatProps> = ({
  serviceType = 'general',
  title = 'AI Assistant',
  className = '',
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { session } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message based on service type
    let welcomeMessage = "Hello! I'm your AI assistant. How can I help you today?";
    
    switch (serviceType) {
      case 'food-delivery':
        welcomeMessage = "Hello! I'm your food delivery assistant. I can help you find restaurants, explore cuisines, or answer questions about food. What are you craving today?";
        break;
      case 'cab-booking':
        welcomeMessage = "Hello! I'm your cab booking assistant. I can help you find rides, estimate fares, or answer transportation questions. Where would you like to go?";
        break;
      case 'hotel-reservation':
        welcomeMessage = "Hello! I'm your hotel reservation assistant. I can help you find accommodations, check amenities, or answer lodging questions. What type of stay are you looking for?";
        break;
      case 'fuel-delivery':
        welcomeMessage = "Hello! I'm your fuel delivery assistant. I can help you order fuel, check prices, or answer questions about fuel types. What fuel do you need?";
        break;
      case 'train-booking':
        welcomeMessage = "Hello! I'm your train booking assistant. I can help you find train routes, check schedules, or answer travel questions. Where are you planning to travel?";
        break;
    }
    
    setMessages([{ role: 'assistant', content: welcomeMessage, timestamp: new Date() }]);
  }, [serviceType]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!session) {
      toast.error("Please log in to use the chat");
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare messages format for OpenAI
      const messageHistory = messages
        .filter(msg => msg.role !== 'system') // Filter out system messages
        .map(msg => ({ role: msg.role, content: msg.content }));
      
      messageHistory.push({ role: 'user', content: input });

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { messages: messageHistory, serviceType },
      });

      if (error) throw error;

      if (data && data.message) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I couldn't process your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className={`flex flex-col h-[550px] ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="flex items-center text-lg">
          <Bot className="h-5 w-5 mr-2 text-orange-500" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                    {message.role === 'user' ? (
                      <>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-orange-100 text-orange-800">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  <div 
                    className={`rounded-lg p-3 text-sm ${
                      message.role === 'user' 
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.timestamp && (
                      <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-orange-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            onClick={sendMessage} 
            disabled={loading || !input.trim()} 
            className="shrink-0"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
