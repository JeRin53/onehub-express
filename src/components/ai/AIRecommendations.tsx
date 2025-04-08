
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";

interface AIRecommendationsProps {
  type: "restaurants" | "hotels" | "cabs" | "general";
  title?: string;
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  type,
  title = "AI Recommendations",
  className = "",
}) => {
  const { session } = useAuth();
  const [displayCount, setDisplayCount] = useState(3);

  const fetchRecommendations = async () => {
    if (!session) {
      throw new Error("You must be logged in to get recommendations");
    }

    const { data, error } = await supabase.functions.invoke("gemini-recommendations", {
      body: { recommendationType: type },
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const {
    data: recommendations,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recommendations", type, session?.user.id],
    queryFn: fetchRecommendations,
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-gray-500 mb-3">Unable to load recommendations</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              className="inline-flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = recommendations?.recommendations || [];
  const message = recommendations?.message || "Based on your activity";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
          {title}
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No recommendations available yet.</p>
            <p className="text-sm text-gray-400 mt-1">Try using the app more to get personalized suggestions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.slice(0, displayCount).map((item: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-1">{item.name || item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                
                {item.cuisine && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 mr-1">Cuisine:</span>
                    <span>{item.cuisine}</span>
                  </div>
                )}
                
                {item.price && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 mr-1">Price:</span>
                    <span>{item.price}</span>
                  </div>
                )}
                
                {item.rating && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 mr-1">Rating:</span>
                    <span>{typeof item.rating === 'number' ? `${item.rating}/5` : item.rating}</span>
                  </div>
                )}
                
                {item.location && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 mr-1">Location:</span>
                    <span>{item.location}</span>
                  </div>
                )}
                
                {item.amenities && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 mr-1">Amenities:</span>
                    <span>{item.amenities}</span>
                  </div>
                )}
                
                {item.type && !item.cuisine && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 mr-1">Type:</span>
                    <span>{item.type}</span>
                  </div>
                )}
              </div>
            ))}
            
            {items.length > displayCount && (
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => setDisplayCount(prev => prev + 3)}
              >
                Show More
              </Button>
            )}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-4 w-full" 
          onClick={() => refetch()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
