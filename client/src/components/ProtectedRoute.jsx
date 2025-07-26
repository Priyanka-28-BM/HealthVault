import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      setHasAccess(profile?.role === allowedRole);
      setLoading(false);
    };

    checkAuth();
  }, [allowedRole]);

  if (loading) return <div>Loading...</div>;
  if (!hasAccess) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
