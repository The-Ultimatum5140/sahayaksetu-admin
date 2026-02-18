import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

// Doctor Pages
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {aToken || dToken ? (
        <>
          <Navbar />

          <div className="flex">
            <Sidebar />

            <div className="ml-64 w-full pt-20 p-6">
              <Routes>
                {/* ADMIN ROUTES */}
                {aToken && (
                  <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/all-appointments"
                      element={<AllAppointments />}
                    />
                    <Route path="/add-doctor" element={<AddDoctor />} />
                    <Route path="/doctor-list" element={<DoctorsList />} />
                  </>
                )}

                {/* DOCTOR ROUTES */}
                {dToken && (
                  <>
                    <Route
                      path="/doctor-dashboard"
                      element={<DoctorDashboard />}
                    />
                    <Route
                      path="/doctor-appointments"
                      element={<DoctorAppointment />}
                    />
                    <Route path="/doctor-profile" element={<DoctorProfile />} />
                  </>
                )}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
