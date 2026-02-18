import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import assets from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (!aToken && !dToken) return null;

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-4 py-3 rounded-xl transition
     ${
       isActive
         ? "bg-primary/10 text-primary font-medium"
         : "text-gray-700 hover:bg-primary/5 hover:text-primary"
     }`;

  return (
    <div className="fixed left-0 top-16 w-16 sm:w-64 h-[calc(100vh-4rem)] bg-white border-r shadow-sm p-2 sm:p-4 transition-all">
      <ul className="space-y-2">
        {/* ADMIN LINKS */}
        {aToken && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              <img src={assets.home_icon} className="h-5" />
              <span className="hidden sm:block">Dashboard</span>
            </NavLink>

            <NavLink to="/all-appointments" className={linkClass}>
              <img src={assets.appointment_icon} className="h-5" />
              <span className="hidden sm:block">Appointments</span>
            </NavLink>

            <NavLink to="/add-doctor" className={linkClass}>
              <img src={assets.add_icon} className="h-5" />
              <span className="hidden sm:block">Add Doctor</span>
            </NavLink>

            <NavLink to="/doctor-list" className={linkClass}>
              <img src={assets.people_icon} className="h-5" />
              <span className="hidden sm:block">Doctors List</span>
            </NavLink>
          </>
        )}

        {/* DOCTOR LINKS */}
        {dToken && (
          <>
            <NavLink to="/doctor-dashboard" className={linkClass}>
              <img src={assets.home_icon} className="h-5" />
              <span className="hidden sm:block">Dashboard</span>
            </NavLink>

            <NavLink to="/doctor-appointments" className={linkClass}>
              <img src={assets.appointment_icon} className="h-5" />
              <span className="hidden sm:block">Appointments</span>
            </NavLink>

            <NavLink to="/doctor-profile" className={linkClass}>
              <img src={assets.people_icon} className="h-5" />
              <span className="hidden sm:block">Profile</span>
            </NavLink>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
