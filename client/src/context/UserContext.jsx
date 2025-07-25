import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data once when app loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get authenticated user data
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setAuthUser(user);
          
          // Try to fetch profile details
          const { data: profileData, error } = await supabase
            .from("profile_details")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (!error && profileData) {
            // Merge auth user data with profile data
            setUserData({
              ...profileData,
              email: user.email,
              id: user.id,
              created_at: user.created_at
            });
          } else {
            // If no profile exists, use auth data only
            setUserData({
              email: user.email,
              id: user.id,
              created_at: user.created_at,
              name: user.user_metadata?.name || '', // Get name from metadata if available
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthUser(session.user);
          // Fetch profile data for the signed-in user
          fetchUserData();
        } else if (event === 'SIGNED_OUT') {
          setAuthUser(null);
          setUserData(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Function to update profile data
  const updateUserData = (newData) => {
    setUserData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const value = {
    userData,
    authUser,
    loading,
    setUserData,
    updateUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};