import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

// Admin Route
export const AdminRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  return aToken ? children : <Navigate to="/" />;
};

// Doctor Route
export const DoctorRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext);
  return dToken ? children : <Navigate to="/" />;
};