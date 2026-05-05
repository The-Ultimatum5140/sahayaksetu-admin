import React, { useContext } from "react";
import assets from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    // remove both tokens safely
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }

    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }

    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <img
            src={assets.admin_logo}
            alt="logo"
            className="h-10 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          />

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-500">Logged in as</span>
            <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              {aToken ? "Admin" : dToken ? "Doctor" : "Guest"}
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-primary text-white 
          shadow-sm hover:shadow-md hover:scale-[1.03] 
          active:scale-[0.97] transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;