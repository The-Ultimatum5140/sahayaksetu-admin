import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import assets from "../../assets/assets";

const AddDoctor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    experience: "1",
    fees: "",
    speciality: "",
    degree: "",
    about: "",
    address1: "",
    address2: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 VALIDATION CHECK
    if (
      !image ||
      !form.name ||
      !form.email ||
      !form.password ||
      !form.degree ||
      !form.fees ||
      !form.speciality ||
      !form.about ||
      !form.address1
    ) {
      return toast.error("Fill all required fields properly");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "fees") {
          formData.append(key, Number(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      });

      formData.append("image", image);
      formData.append(
        "address",
        JSON.stringify({
          line1: form.address1,
          line2: form.address2,
        }),
      );

      // ✅ CORRECT ROUTE (important)
      const { data } = await API.post("/api/admin/add-doctor", formData);

      if (data.success) {
        toast.success("Doctor Added");

        // reset
        setForm({
          name: "",
          email: "",
          password: "",
          experience: "1",
          fees: "",
          speciality: "",
          degree: "",
          about: "",
          address1: "",
          address2: "",
        });
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow"
    >
      <h2 className="text-xl font-semibold">Add Doctor</h2>

      {/* IMAGE */}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      {/* INPUTS */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="input"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="input"
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        className="input"
      />

      <select
        name="experience"
        value={form.experience}
        onChange={handleChange}
        className="input"
      >
        {[...Array(10)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1} Years
          </option>
        ))}
      </select>

      <input
        name="fees"
        value={form.fees}
        onChange={handleChange}
        placeholder="Fees"
        type="number"
        className="input"
      />

      <select
        name="speciality"
        value={form.speciality}
        onChange={handleChange}
        className="input"
      >
        <option value="">Select Speciality</option>
        <option value="General Physician">General Physician</option>
        <option value="Gynecologist">Gynecologist</option>
        <option value="Dermatologist">Dermatologist</option>
        <option value="Pediatrician">Pediatrician</option>
        <option value="Neurologist">Neurologist</option>
        <option value="Gastroenterologist">Gastroenterologist</option>
        <option value="Other">Other</option>
      </select>
      <input
        name="degree"
        value={form.degree}
        onChange={handleChange}
        placeholder="Degree"
        className="input"
      />

      <textarea
        name="about"
        value={form.about}
        onChange={handleChange}
        placeholder="About"
        className="input"
      />

      <input
        name="address1"
        value={form.address1}
        onChange={handleChange}
        placeholder="Address 1"
        className="input"
      />
      <input
        name="address2"
        value={form.address2}
        onChange={handleChange}
        placeholder="Address 2"
        className="input"
      />

      <button className="bg-blue-600 text-white px-6 py-2 rounded">
        {loading ? "Adding..." : "Add Doctor"}
      </button>
    </form>
  );
};

export default AddDoctor;
