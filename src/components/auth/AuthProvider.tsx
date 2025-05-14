import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialAuthChecked = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only run this effect once
    if (initialAuthChecked.current) return;
    initialAuthChecked.current = true;
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log("In getting session");
        console.log("Supabase client initialized:", !!supabase);
        console.log("Calling supabase.auth.getSession()...");
        const { data: { user } } = await supabase.auth.getUser();
        console.log("user", user);
        const { data, error } = await supabase.auth.getSession()
        
        console.log("getSession call completed");

        if (error){
          console.error("Error getting session:", error);
        }
        console.log("session data:", data);
        setSession(data.session);
        if (data.session) {
          setUser(data.session?.user ?? null);
          fetchProfile(data.session?.user?.id ?? "");
        }
      } catch (error) {
        console.error("Error in getSession function:", error);
      } finally {
        console.log("getSession function completed");
        setIsLoading(false);
      }
    }
    
    if(!session) {
      console.log("getting session");
      getSession();
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log("IN AUTH CHANGE", session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      // Using 'any' type to bypass the type checking issue temporarily
      // This should be fixed by updating your Database type definitions

      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      const { error } = await supabase.auth.signOut();
      console.log("signOut call completed");
      if (error) throw error;
      
      // Redirect to splash page after successful sign out
      navigate("/splash");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
