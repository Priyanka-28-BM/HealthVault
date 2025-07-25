import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MedicalFiles from "./components/medicalfiles";
import Footer from "./components/Footer";

import PatientDashboard from "./components/dashboards/PatientDashboard";
import DoctorDashboard from "./components/dashboards/DoctorDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- Public Routes (with Navbar + Footer) ---------- */}
        {["/", "/login", "/signup", "/medicalfiles"].map((path, index) => (
          <Route
            key={index}
            path={path}
            element={
              <>
                <Navbar />
                {path === "/" && <Home />}
                {path === "/login" && <Login />}
                {path === "/signup" && <Signup />}
                {path === "/medicalfiles" && <MedicalFiles />}
                <Footer />
              </>
            }
          />
        ))}

        {/* ---------- Protected Dashboard Routes (NO Navbar/Footer) ---------- */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Optional 404 Not Found Page */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;

