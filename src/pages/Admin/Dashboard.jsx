import React, { useContext, useEffect, useState, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import assets from "../../assets/assets";

const Dashboard = () => {
  const { aToken, dashData, getDashData } = useContext(AdminContext);
  const [loading, setLoading] = useState(true);

  // 📌 FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!aToken) {
          setLoading(false);
          return;
        }

        await getDashData();
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [aToken]);

  // 📌 DATE FORMATTER (robust)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    try {
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

      const fallback = new Date(dateStr);
      if (!isNaN(fallback)) {
        return fallback.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }

      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // 📌 MEMOIZED DATA
  const latestAppointments = useMemo(() => {
    return dashData?.latestAppointments || [];
  }, [dashData]);

  // 📌 LOADING
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading dashboard... </p>
    );
  }

  if (!dashData) {
    return (
      <p className="text-center mt-10 text-gray-400">No data available </p>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Doctors"
          img={assets.doctor_icon}
          value={dashData.doctors || 0}
        />
        <StatCard
          title="Patients"
          img={assets.patients_icon}
          value={dashData.patients || 0}
        />
        <StatCard
          title="Appointments"
          img={assets.appointment_icon}
          value={dashData.appointments || 0}
        />
      </div>

      {/* 🔥 LATEST APPOINTMENTS */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Latest Appointments
        </h2>

        {latestAppointments.length === 0 ? (
          <p className="text-gray-400">No appointments yet</p>
        ) : (
          <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center gap-2 text-gray-600">
              <img src={assets.list_icon} alt="" className="w-5" />
              <p className="font-medium">Recent Bookings</p>
            </div>

            {/* LIST */}
            {latestAppointments.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 rounded-xl p-4 border hover:shadow-md hover:bg-blue-50 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.docData?.image || assets.profile_pic}
                    alt="doctor"
                    className="w-12 h-12 rounded-full object-cover border"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.docData?.name || "Doctor"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Patient: {item.userData?.name || "—"}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-start md:items-end gap-1">
                  <p className="text-sm text-gray-500">
                    {formatDate(item.slotDate)} | {item.slotTime}
                  </p>

                  {item.cancelled ? (
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                      Pending
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

// STAT CARD
const StatCard = ({ title, value, img }) => (
  <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition">
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
