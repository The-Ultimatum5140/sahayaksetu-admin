import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import assets from "../../assets/assets";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) getDashData();
  }, [dToken]);

  if (!dashData)
    return <p className="p-6 text-gray-400">Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800">Doctor Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Earnings"
          value={`₹${dashData.earnings}`}
          img={assets.earning_icon}
        />

        <Card
          title="Appointments"
          value={dashData.appointments}
          img={assets.appointments_icon}
        />

        <Card
          title="Patients"
          value={dashData.patients}
          img={assets.patients_icon}
        />
      </div>

      {/* LATEST APPOINTMENTS */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Latest Appointments</h2>

        {dashData.latestAppointments?.length === 0 ? (
          <p className="text-gray-400">No appointments yet</p>
        ) : (
          <div className="divide-y">
            {dashData.latestAppointments.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center py-3 text-sm hover:bg-gray-50 px-2 rounded transition"
              >
                {/* Patient */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.userData?.image}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.userData?.name}</p>
                    <p className="text-gray-500 text-xs">
                      {item.slotDate} | {item.slotTime}
                    </p>
                  </div>
                </div>

                {/* Status */}
                {item.cancelled ? (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    Done
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    Scheduled
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- CARD COMPONENT ---------- */

const Card = ({ title, value, img }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-lg transition">
    <div className="bg-blue-100 p-3 rounded-xl">
      <img src={img} className="w-8 h-8" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DoctorDashboard;
