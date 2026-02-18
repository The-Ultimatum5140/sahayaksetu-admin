import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  // fetch doctors
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  // toggle availability with refresh
  const handleToggle = async (id) => {
    await changeAvailability(id);
    await getAllDoctors(); // refresh list after change
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Doctors</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <p className="font-semibold text-lg text-gray-800">
                {item.name}
              </p>

              <p className="text-sm text-primary font-medium">
                {item.speciality}
              </p>

              {/* Availability */}
              <div className="flex items-center justify-between pt-3">
                <p
                  className={`text-sm font-medium ${
                    item.available ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.available ? "Available" : "Not Available"}
                </p>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => handleToggle(item._id)}
                    className="sr-only peer"
                  />

                  {/* Toggle bg */}
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-primary transition"></div>

                  {/* Toggle dot */}
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
