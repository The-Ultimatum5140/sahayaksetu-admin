import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const DoctorAppointment = () => {
  const navigate = useNavigate();

  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const [loading, setLoading] = useState(true);

  // 📌 FETCH DATA (safe)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dToken) {
          await getAppointments();
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dToken, getAppointments]);

  // 📌 FORMAT DATE (safe parsing)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const parts = dateStr.split(/[-_\/]/);
    if (parts.length === 3) {
      const [d, m, y] = parts;
      const date = new Date(`${y}-${m}-${d}`);
      if (!isNaN(date)) {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }
    return dateStr;
  };

  // 📌 CALCULATE AGE (accurate)
  const calculateAge = (dob) => {
    if (!dob) return "—";

    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return "—";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // 📌 LOADING
  if (loading) {
    return <p className="text-center mt-10">Loading appointments...</p>;
  }

  // 📌 EMPTY STATE
  if (!appointments || appointments.length === 0) {
    return <p className="text-center mt-10">No appointments found</p>;
  }

  return (
    <div className="p-6">
      {" "}
      <h1 className="text-2xl font-semibold mb-6">All Appointments</h1>
      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        {/* HEADER */}
        <div className="min-w-[900px] grid grid-cols-7 bg-gray-100 px-6 py-3 text-sm font-semibold border-b">
          <p className="text-center">#</p>
          <p>Patient</p>
          <p className="text-center">Payment</p>
          <p className="text-center">Age</p>
          <p>Date & Time</p>
          <p className="text-center">Fees</p>
          <p className="text-center">Action</p>
        </div>

        {appointments.map((item, i) => (
          <div
            key={item._id}
            className="min-w-[900px] grid grid-cols-7 items-center px-6 py-4 border-b text-sm hover:bg-gray-50"
          >
            {/* INDEX */}
            <p className="text-center">{i + 1}</p>

            {/* PATIENT */}
            <div className="flex items-center gap-3">
              <img
                src={item.userData?.image || assets.profile_pic}
                className="w-10 h-10 rounded-full object-cover"
                alt="patient"
              />
              <p className="truncate max-w-[120px]">
                {item.userData?.name || "Unknown"}
              </p>
            </div>

            {/* PAYMENT */}
            <p className="text-center">{item.payment ? "Online" : "Cash"}</p>

            {/* AGE */}
            <p className="text-center">{calculateAge(item.userData?.dob)}</p>

            {/* DATE */}
            <p className="whitespace-nowrap">
              {formatDate(item.slotDate)} | {item.slotTime}
            </p>

            {/* FEES */}
            <p className="text-center font-medium">₹{item.amount}</p>

            {/* ACTION */}
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {item.cancelled ? (
                <span className="text-xs font-medium text-red-600">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <>
                  <span className="text-xs font-medium text-green-600">
                    Done
                  </span>

                  {/* 🔥 EDIT / VIEW RX */}
                  <button
                    onClick={() => navigate(`/doctor/prescription/${item._id}`)}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full"
                  >
                    View / Edit Rx
                  </button>
                </>
              ) : (
                <>
                  {/* COMPLETE */}
                  <img
                    src={assets.tick_icon}
                    onClick={() => {
                      if (window.confirm("Mark as completed?")) {
                        completeAppointment(item._id);
                      }
                    }}
                    className="w-6 cursor-pointer"
                  />

                  {/* CANCEL */}
                  <img
                    src={assets.cancel_icon}
                    onClick={() => {
                      if (window.confirm("Cancel this appointment?")) {
                        cancelAppointment(item._id);
                      }
                    }}
                    className="w-6 cursor-pointer"
                  />

                  {/* ADD RX (optional before complete bhi dikha sakte) */}
                  <button
                    onClick={() => navigate(`/doctor/prescription/${item._id}`)}
                    className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full"
                  >
                    Add Rx
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointment;
