import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import assets from "../../assets/assets";

const Dashboard = () => {
  const { aToken, dashData, getDashData } = useContext(AdminContext);

  // Date Formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const parts = dateStr.split(/[-_\/]/);

    if (parts.length === 3) {
      const [day, month, year] = parts;
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date)) {
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    }

    const date = new Date(dateStr);
    if (!isNaN(date)) {
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return dateStr;
  };

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  if (!dashData)
    return <p className="text-gray-400 p-6">Loading dashboard...</p>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Doctors"
          img={assets.doctor_icon}
          value={dashData.doctors}
        />
        <Card
          title="Patients"
          img={assets.patients_icon}
          value={dashData.patients}
        />
        <Card
          title="Appointments"
          img={assets.appointment_icon}
          value={dashData.appointments}
        />
      </div>

      {/* Latest Appointments */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Latest Appointments
        </h2>

        {!dashData.latestAppointments ||
        dashData.latestAppointments.length === 0 ? (
          <p className="text-gray-400">No appointments yet</p>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center gap-2 mb-3 text-gray-600">
              <img src={assets.list_icon} alt="" className="w-5" />
              <p className="font-medium">Recent Bookings</p>
            </div>
            {dashData.latestAppointments.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border hover:shadow-lg hover:scale-[1.01] hover:bg-blue-50 transition duration-200"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.docData?.image}
                    alt="doctor"
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.docData?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Patient: {item.userData?.name}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col items-end gap-1">
                  <p className="text-sm text-gray-500">
                    {formatDate(item.slotDate)} | {item.slotTime}
                  </p>

                  {item.cancelled ? (
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                      Cancelled
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full font-medium">
                      Confirmed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
//  Card Component
const Card = ({ title, value, img }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50 transition duration-300">
    <div className="p-3 bg-blue-100 rounded-xl">
      <img src={img} alt={title} className="w-8 h-8" />
    </div>

    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Dashboard;
