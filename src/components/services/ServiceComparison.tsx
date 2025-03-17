
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, Clock, ArrowRight, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export type ServiceProvider = {
  id: string;
  name: string;
  logo?: string;
  price?: string | number;
  rating?: number;
  votes?: number;
  eta?: string;
  features?: string[];
  discount?: string;
  bestFor?: string;
  redirectUrl?: string;
};

interface ServiceComparisonProps {
  title: string;
  description?: string;
  providers: ServiceProvider[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  loading?: boolean;
  className?: string;
}

const ServiceComparison: React.FC<ServiceComparisonProps> = ({
  title,
  description,
  providers,
  activeTab,
  onTabChange,
  loading = false,
  className = "",
}) => {
  // Default to first provider if no active tab
  const [currentTab, setCurrentTab] = useState(activeTab || (providers.length > 0 ? providers[0].id : ""));

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleRedirect = (provider: ServiceProvider) => {
    // In a real app, this would redirect to the provider's site or app
    if (provider.redirectUrl) {
      toast.success(`Redirecting to ${provider.name}...`);
      // window.open(provider.redirectUrl, "_blank");
    } else {
      toast.info(`Redirection to ${provider.name} would happen here`);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-200 h-6 w-2/3 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-gray-200 h-4 w-1/2 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (providers.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description || "Compare different service providers"}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No providers available to compare</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description || "Compare different service providers"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full mb-4">
            {providers.map((provider) => (
              <TabsTrigger key={provider.id} value={provider.id} className="flex-1">
                {provider.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {providers.map((provider) => (
            <TabsContent key={provider.id} value={provider.id}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      {provider.logo ? (
                        <img
                          src={provider.logo}
                          alt={provider.name}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <span className="text-xl font-bold">{provider.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      {provider.bestFor && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>Best for {provider.bestFor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {provider.discount && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      {provider.discount}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {provider.price !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Price</span>
                      <span className="font-semibold">
                        {typeof provider.price === "number"
                          ? `₹${provider.price.toFixed(2)}`
                          : provider.price}
                      </span>
                    </div>
                  )}

                  {provider.rating !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">Rating</span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold">
                          {provider.rating.toFixed(1)}
                          {provider.votes && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({provider.votes})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {provider.eta && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">ETA</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="font-semibold">{provider.eta}</span>
                      </div>
                    </div>
                  )}
                </div>

                {provider.features && provider.features.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">Features</span>
                    <div className="flex flex-wrap gap-2">
                      {provider.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="font-normal">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => handleRedirect(provider)}
                >
                  Continue with {provider.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ServiceComparison;
