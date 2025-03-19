
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile data - enhanced with better error handling
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      // Try to get from profiles table if it exists
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error("Error fetching user profile from database:", error);
        }
        
        // If profile couldn't be fetched from database, try auth metadata
        const { data: userData } = await supabase.auth.getUser();
        console.log("Auth user data:", userData);
        
        if (userData?.user?.user_metadata) {
          console.log("Setting profile from auth metadata:", userData.user.user_metadata);
          setUserProfile({
            first_name: userData.user.user_metadata.first_name,
            last_name: userData.user.user_metadata.last_name,
            display_name: userData.user.user_metadata.full_name,
            avatar_url: userData.user.user_metadata.avatar_url,
          });
        } else {
          // Default to email if no other name information is available
          console.log("Using email for profile display name:", userData?.user?.email);
          setUserProfile({
            display_name: userData?.user?.email?.split('@')[0],
            first_name: userData?.user?.email?.split('@')[0],
          });
        }
      } else {
        console.log("Profile found in database:", data);
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      toast.error("Failed to load your profile");
    }
  };

  // Function to refresh the user profile
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        console.log("Getting initial auth session");
        const { data } = await supabase.auth.getSession();
        
        console.log("Initial session data:", data.session ? "exists" : "null");
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          await fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        toast.error("Authentication error occurred");
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession ? "session exists" : "no session");
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUserProfile(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const value = {
    user,
    session,
    userProfile,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
