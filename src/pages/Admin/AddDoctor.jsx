import React, { useContext, useState } from "react";
import assets from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [speciality, setSpeciality] = useState("");
  const [customSpeciality, setCustomSpeciality] = useState("");
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [about, setAbout] = useState("");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [fees, setFees] = useState("");
  const [address2, setAddress2] = useState("");

  // getting the backend url from the context
  const { backendUrl, aToken } = useContext(AdminContext);

  //   button onsubmit

 const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    if (!docImg) return toast.error("Image not selected!");

    const finalSpeciality =
      speciality === "Other" ? customSpeciality : speciality;

    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", Number(fees));
    formData.append("about", about);
    formData.append("speciality", finalSpeciality);
    formData.append("degree", degree);
    formData.append(
      "address",
      JSON.stringify({
        line1: address1,
        line2: address2,
      })
    );

    const { data } = await axios.post(
      backendUrl + "/api/admin/add-doctor",
      formData,
      { headers: { aToken } }
    );

    if (data.success) {
      toast.success(data.message);
      setDocImg(false)
      setName('')
      setEmail('')
      setPassword('')
      setAbout('')
      setAddress1('')
      setAddress2('')
      setFees('')
      setDegree('')
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error("Something went wrong");
    console.log(err);
  }
};

// todo will be adding all doctors in the database through frontend button 


  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-sm border space-y-8"
    >
      <h1 className="text-2xl font-semibold text-gray-800">Add New Doctor</h1>

      {/* Upload */}
      <div className="flex items-center gap-6">
        <label
          htmlFor="doc-img"
          className="w-28 h-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition"
        >
          <img
            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            alt=""
            className="w-12 opacity-70"
          />
        </label>

        <input
          onChange={(e) => setDocImg(e.target.files[0])}
          type="file"
          id="doc-img"
          hidden
        />

        <p className="text-gray-500 text-sm leading-relaxed">
          Upload doctor profile picture
          <br /> JPG, PNG allowed
        </p>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Doctor Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              type="text"
              placeholder="Enter doctor name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              type="email"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              type="password"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Experience
            </label>
            <select
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i}>{i + 1} Years</option>
              ))}
              <option>10+ Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Consultation Fees
            </label>
            <input
              onChange={(e) => setFees(e.target.value)}
              value={fees}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              type="number"
              placeholder="Enter fees"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Speciality
            </label>

            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Select speciality</option>
              <option>General Physician</option>
              <option>Gynecologist</option>
              <option>Dermatologist</option>
              <option>Pediatrician</option>
              <option>Neurologist</option>
              <option>Gastroenterologist</option>
              <option value="Other">Other</option>
            </select>

            {/* Show extra input if Other selected */}
            {speciality === "Other" && (
              <input
                type="text"
                placeholder="Please specify speciality"
                value={customSpeciality}
                onChange={(e) => setCustomSpeciality(e.target.value)}
                className="w-full mt-2 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Education
            </label>
            <input
              onChange={(e) => setDegree(e.target.value)}
              value={degree}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              type="text"
              placeholder="Enter qualification"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              onChange={(e) => setAddress1(e.target.value)}
              value={address1}
              className="w-full px-4 py-2.5 border rounded-lg mb-2 focus:ring-2 focus:ring-primary outline-none"
              type="text"
              placeholder="Address line 1"
            />
            <input
              onChange={(e) => setAddress2(e.target.value)}
              value={address2}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              type="text"
              placeholder="Address line 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              About Doctor
            </label>
            <textarea
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              rows={4}
              placeholder="Write something about doctor"
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:shadow-md hover:scale-[1.02] transition"
      >
        Add Doctor
      </button>
    </form>
  );
};

export default AddDoctor;
