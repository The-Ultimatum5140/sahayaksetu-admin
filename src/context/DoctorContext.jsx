import React, { createContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import API from "../services/api"; // 🔥 IMPORTANT

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // ---------------- GET APPOINTMENTS ----------------
  const getAppointments = useCallback(async () => {
    try {
      const { data } = await API.get("/api/doctor/appointments");

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, []);

  // ---------------- COMPLETE ----------------
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await API.post("/api/doctor/complete-appointment", {
        appointmentId,
      });

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ---------------- CANCEL ----------------
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await API.post("/api/doctor/cancel-appointment", {
        appointmentId,
      });

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ---------------- DASHBOARD ----------------
  const getDashData = async () => {
    try {
      const { data } = await API.get("/api/doctor/dashboard");

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ---------------- PROFILE GET ----------------
  const getProfileData = async () => {
    try {
      const { data } = await API.get("/api/doctor/profile");

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ---------------- PROFILE UPDATE ----------------
  const updateProfile = async (profile) => {
    try {
      const { data } = await API.post("/api/doctor/update-profile", profile);

      if (data.success) {
        toast.success("Profile updated successfully");
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    updateProfile,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
