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

  // prevent both login
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
            isAdmin ? (
              <Navigate to="/dashboard" />
            ) : isDoctor ? (
              <Navigate to="/doctor-dashboard" />
            ) : (
              <Login />
            )
          }
        />

        {/* ================= ADMIN ================= */}
        {isAdmin && (
          <>
            <Route
              path="/dashboard"
              element={
                <Layout role="admin">
                  <Dashboard />
                </Layout>
              }
            />

            <Route
              path="/all-appointments"
              element={
                <Layout role="admin">
                  <AllAppointments />
                </Layout>
              }
            />

            <Route
              path="/add-doctor"
              element={
                <Layout role="admin">
                  <AddDoctor />
                </Layout>
              }
            />

            <Route
              path="/doctor-list"
              element={
                <Layout role="admin">
                  <DoctorsList />
                </Layout>
              }
            />
          </>
        )}

        {/* ================= DOCTOR ================= */}
        {isDoctor && (
          <>
            <Route
              path="/doctor-dashboard"
              element={
                <Layout role="doctor">
                  <DoctorDashboard />
                </Layout>
              }
            />

            <Route
              path="/doctor-appointments"
              element={
                <Layout role="doctor">
                  <DoctorAppointment />
                </Layout>
              }
            />

            <Route
              path="/doctor-profile"
              element={
                <Layout role="doctor">
                  <DoctorProfile />
                </Layout>
              }
            />

            <Route
              path="/doctor/prescription/:appointmentId"
              element={
                <Layout role="doctor">
                  <AddPrescription />
                </Layout>
              }
            />
          </>
        )}

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

// 🔥 REUSABLE LAYOUT (BEST PRACTICE)
const Layout = ({ children, role }) => {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <div className="ml-64 w-full pt-20 p-6">{children}</div>
      </div>
    </div>
  );
};

export default App;
