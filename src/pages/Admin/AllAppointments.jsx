import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import assets from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  // Format Date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [d, m, y] = dateStr.split("_");

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${d} ${months[m - 1]} ${y}`;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        All Appointments
      </h1>

      {/* Table Wrapper */}
      <div className="bg-white shadow-sm rounded-2xl border overflow-hidden">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-7 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {/* Body */}
        <div className="divide-y">
          {appointments.length === 0 && (
            <p className="text-center py-12 text-gray-400">
              No appointments found
            </p>
          )}

          {appointments.map((item, index) => (
            <div
              key={item._id}
              className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-0 px-6 py-4 items-center 
              hover:bg-blue-50/40 transition-all duration-200 group"
            >
              {/* Index */}
              <p className="font-medium text-gray-700">{index + 1}</p>

              {/* Patient */}
              <div className="flex items-center gap-3">
                {item.userData?.image ? (
                  <img
                    src={item.userData.image}
                    alt="patient"
                    className="w-10 h-10 rounded-full object-cover border 
                    group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {item.userData?.name?.charAt(0) || "U"}
                  </div>
                )}

                <p className="text-gray-800 font-medium">
                  {item.userData?.name || "—"}
                </p>
              </div>

              {/* Age */}
              <p className="text-gray-600 hidden md:block">
                {item.userData?.dob ? calculateAge(item.userData.dob) : "—"}
              </p>

              {/* Date */}
              <p className="text-gray-600">
                {formatDate(item.slotDate)} | {item.slotTime}
              </p>

              {/* Doctor */}
              <p className="text-gray-800 font-medium">
                {item.docData?.name || "—"}
              </p>

              {/* Fees */}
              <p className="font-semibold text-gray-900">₹{item.amount}</p>

              {/* Status / Action */}
              <div className="flex items-center gap-2">
                {item.cancelled ? (
                  <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                    Cancelled
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-600 rounded-full 
                    hover:bg-red-100 hover:scale-105 active:scale-95 transition"
                  >
                    <img
                      src={assets.cancel_icon}
                      alt="cancel"
                      className="w-4"
                    />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
