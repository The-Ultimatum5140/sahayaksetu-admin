import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, updateProfile } =
    useContext(DoctorContext);

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  useEffect(() => {
    if (profileData) setForm(profileData);
  }, [profileData]);

  if (!form)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading doctor profile...
      </div>
    );

  const handleSave = () => {
    updateProfile({
      fees: form.fees,
      address: form.address,
      available: form.available,
    });
    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* CARD */}
        <div className="backdrop-blur-lg bg-white/80 shadow-xl rounded-3xl border border-white/40 p-8 transition hover:shadow-2xl">
          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* IMAGE */}
            <div className="relative group">
              <img
                src={form.image}
                className="w-40 h-40 rounded-2xl object-cover shadow-md border-4 border-white group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition"></div>
            </div>

            {/* INFO */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-800">
                {form.name}
              </h1>

              <p className="text-blue-600 font-medium">
                {form.degree} • {form.speciality}
              </p>

              <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-sm">
                {form.experience} Experience
              </span>
            </div>
          </div>

          {/* ABOUT */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              About Doctor
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              {form.about}
            </p>
          </div>

          {/* FEES + ADDRESS */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* FEES */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 border shadow-sm hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Appointment Fee
              </p>

              {edit ? (
                <input
                  type="number"
                  value={form.fees}
                  onChange={(e) => setForm({ ...form, fees: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                />
              ) : (
                <p className="text-2xl font-semibold text-gray-800">
                  ₹{form.fees}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 border shadow-sm hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Clinic Address
              </p>

              {edit ? (
                <div className="space-y-2">
                  <input
                    value={form.address?.line1}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: {
                          ...form.address,
                          line1: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                  />

                  <input
                    value={form.address?.line2}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: {
                          ...form.address,
                          line2: e.target.value,
                        },
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>
              ) : (
                <p className="text-gray-700">
                  {form.address?.line1}
                  <br />
                  {form.address?.line2}
                </p>
              )}
            </div>
          </div>

          {/* AVAILABILITY SWITCH */}
          <div className="mt-8 flex items-center gap-4">
            <div
              onClick={() =>
                edit && setForm({ ...form, available: !form.available })
              }
              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition
              ${form.available ? "bg-green-400" : "bg-gray-300"}
              ${!edit && "opacity-60 cursor-not-allowed"}`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow transform transition
                ${form.available ? "translate-x-7" : ""}`}
              />
            </div>

            <span className="text-gray-700 text-sm">Available for booking</span>
          </div>

          {/* BUTTONS */}
          <div className="mt-10 flex gap-4">
            {edit ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 hover:scale-105 transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setEdit(false);
                    setForm(profileData);
                  }}
                  className="px-6 py-2 rounded-xl border hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEdit(true)}
                className="px-6 py-2 rounded-xl bg-gray-900 text-white shadow hover:bg-black hover:scale-105 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
