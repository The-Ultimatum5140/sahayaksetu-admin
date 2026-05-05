import { createContext, useState } from "react";
import API from "../pages/services/api";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  // // reusable axios config
  // const authConfig = {
  //   headers: {
  //     Authorization: `Bearer ${aToken}`,
  //   },
  // };

  // ================= GET ALL DOCTORS =================
  const getAllDoctors = async () => {
    try {
      const { data } = await API.get("/api/admin/all-doctors");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= CHANGE AVAILABILITY =================
  const changeAvailability = async (docId) => {
    try {
      const { data } = await API.post("/api/admin/change-availability", {
        docId,
      });

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= GET ALL APPOINTMENTS =================
  const getAllAppointments = async () => {
    try {
      const { data } = await API.post("/api/admin/appointments", {});

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ================= CANCEL APPOINTMENT =================
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await API.post(`/api/admin/cancel-appointment`, {
        appointmentId,
      });

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ==============dashboard data================
  const getDashData = async () => {
    try {
      const { data } = await API.get("/api/admin/dashboard");

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    appointments,
    getAllDoctors,
    changeAvailability,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
