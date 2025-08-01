import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar2 from "./components/Navbar2";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import MedicalFiles from "./components/medicalfiles";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import AuthRedirect from "./Pages/AuthRedirect";
import Profile from "./components/Profile";
function App() {
  return (
    <>
      <Navbar2 />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/medicalcfiles" element={<MedicalFiles />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/profile" element={<Profile />} />

        {/* Optional 404 Page */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />
    </>
  );
}

export default App;
