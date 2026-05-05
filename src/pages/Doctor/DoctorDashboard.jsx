import React, { useContext, useEffect, useMemo, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const { dToken, appointments, getAppointments } = useContext(DoctorContext);

  const [loading, setLoading] = useState(true);

  // 📌 FETCH DATA (safe)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dToken) {
          await getAppointments();
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dToken, getAppointments]);

  // 📌 STATS (memoized)
  const stats = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return {
        total: 0,
        completed: 0,
        cancelled: 0,
        pending: 0,
        earnings: 0,
      };
    }

    let completed = 0;
    let cancelled = 0;
    let pending = 0;
    let earnings = 0;

    appointments.forEach((a) => {
      if (a.cancelled) {
        cancelled++;
      } else if (a.isCompleted) {
        completed++;
        earnings += a.amount || 0;
      } else {
        pending++;
      }
    });

    return {
      total: appointments.length,
      completed,
      cancelled,
      pending,
      earnings,
    };
  }, [appointments]);

  // 📌 RECENT APPOINTMENTS (latest 5)
  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [appointments]);

  // 📌 LOADING
  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="text-xl font-semibold">{stats.total}</h2>
        </div>

        <div className="bg-green-50 border rounded-xl p-4 text-center">
          <p className="text-green-600 text-sm">Completed</p>
          <h2 className="text-xl font-semibold">{stats.completed}</h2>
        </div>

        <div className="bg-yellow-50 border rounded-xl p-4 text-center">
          <p className="text-yellow-600 text-sm">Pending</p>
          <h2 className="text-xl font-semibold">{stats.pending}</h2>
        </div>

        <div className="bg-red-50 border rounded-xl p-4 text-center">
          <p className="text-red-600 text-sm">Cancelled</p>
          <h2 className="text-xl font-semibold">{stats.cancelled}</h2>
        </div>

        <div className="bg-blue-50 border rounded-xl p-4 text-center">
          <p className="text-blue-600 text-sm">Earnings</p>
          <h2 className="text-xl font-semibold">₹{stats.earnings}</h2>
        </div>
      </div>

      {/* 🔥 QUICK ACTIONS */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => navigate("/doctor-appointments")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          View Appointments
        </button>

        <button
          onClick={() => navigate("/doctor-profile")}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          My Profile
        </button>
      </div>

      {/* 🔥 RECENT APPOINTMENTS */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="px-6 py-3 border-b font-medium">
          Recent Appointments
        </div>

        {recentAppointments.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No recent appointments
          </p>
        ) : (
          recentAppointments.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center px-6 py-3 border-b text-sm"
            >
              <div>
                <p className="font-medium">
                  {item.userData?.name || "Patient"}
                </p>
                <p className="text-gray-500 text-xs">
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>

              <div>
                {item.cancelled ? (
                  <span className="text-red-500 text-xs">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="text-green-600 text-xs">Completed</span>
                ) : (
                  <span className="text-yellow-600 text-xs">Pending</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
