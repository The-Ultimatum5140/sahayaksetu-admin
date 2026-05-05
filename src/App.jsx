import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import AddPrescription from "./pages/Doctor/AddPrescription";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isAdmin = !!aToken;
  const isDoctor = !!dToken;

  if (isAdmin && isDoctor) {
    localStorage.removeItem("dToken");
    window.location.reload();
    return null;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC */}
        <Route
          path="/"
          element={
            isAdmin
              ? <Navigate to="/dashboard" />
              : isDoctor
              ? <Navigate to="/doctor-dashboard" />
              : <Login />
          }
        />

        {/* ADMIN */}
        {isAdmin && (
          <Route path="/*" element={
            <div>
              <Navbar />
              <div className="flex">
                <Sidebar role="admin" />
                <div className="ml-64 w-full pt-20 p-6">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/all-appointments" element={<AllAppointments />} />
                    <Route path="/add-doctor" element={<AddDoctor />} />
                    <Route path="/doctor-list" element={<DoctorsList />} />
                  </Routes>
                </div>
              </div>
            </div>
          } />
        )}

        {/* DOCTOR */}
        {isDoctor && (
          <Route path="/*" element={
            <div>
              <Navbar />
              <div className="flex">
                <Sidebar role="doctor" />
                <div className="ml-64 w-full pt-20 p-6">
                  <Routes>
                    <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor-appointments" element={<DoctorAppointment />} />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />

                    {/* 🔥 IMPORTANT */}
                    <Route
                      path="/doctor/prescription/:appointmentId"
                      element={<AddPrescription />}
                    />
                  </Routes>
                </div>
              </div>
            </div>
          } />
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;