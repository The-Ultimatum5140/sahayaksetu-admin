import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import assets from "../../assets/assets";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Appointments</h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
        {/* Header */}
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
            <p className="text-center">{i + 1}</p>

            <div className="flex items-center gap-3">
              <img
                src={item.userData?.image}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p>{item.userData?.name}</p>
            </div>

            <p className="text-center">{item.payment ? "Online" : "Cash"}</p>

            <p className="text-center">{item.userData?.age || "—"}</p>

            <p>
              {formatDate(item.slotDate)} | {item.slotTime}
            </p>

            <p className="text-center font-medium">₹{item.amount}</p>

            {/* ACTION */}
            <div className="flex justify-center items-center gap-2">
              {item.cancelled ? (
                <>
                  <img src={assets.cancel_icon} className="w-5 opacity-70" />
                  <span className="text-xs font-medium text-red-600">
                    Cancelled
                  </span>
                </>
              ) : item.isCompleted ? (
                <>
                  <img src={assets.tick_icon} className="w-5" />
                  <span className="text-xs font-medium text-green-600">
                    Done
                  </span>
                </>
              ) : (
                <>
                  <img
                    src={assets.tick_icon}
                    onClick={() => completeAppointment(item._id)}
                    className="w-6 cursor-pointer hover:scale-110 transition"
                    title="Mark as Done"
                  />
                  <img
                    src={assets.cancel_icon}
                    onClick={() => cancelAppointment(item._id)}
                    className="w-6 cursor-pointer hover:scale-110 transition"
                    title="Cancel Appointment"
                  />
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
