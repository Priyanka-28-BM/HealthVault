// src/Pages/AuthRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const query = new URLSearchParams(hash.replace("#", "?"));
    const access_token = query.get("access_token");
    const refresh_token = query.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(() => {
          console.log("Session restored");
          navigate("/update-password");
        })
        .catch((err) => {
          console.error("Session restore failed", err);
        });
    } else {
      console.error("Tokens not found in URL");
    }
  }, [navigate]);

  return <p>Redirecting...</p>;
};

export default AuthRedirect;
