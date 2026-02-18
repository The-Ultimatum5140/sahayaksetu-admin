import React, { useState, useContext } from "react";
import assets from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const {setDToken } = useContext(DoctorContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
        } else {
          setError(data.message);
          toast.error(data.message);
        }
      } else {
        // Doctor login logic here later
        const {data} = await axios.post(backendUrl+'/api/doctor/login',{email,password})
        // checking response
        if(data.success){
          localStorage.setItem('dToken',data.token)
          setDToken(data.token)
          console.log(data.token)
        }else{
          toast.error(data.message)
        }
      }
    } catch(err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl p-8 sm:p-10 space-y-6 border border-gray-100 transition-all duration-300"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={assets.admin_logo}
            alt="SahayakSetu Logo"
            className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-center tracking-wide">
          <span className="text-primary">{state}</span> Login
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            placeholder="Enter your password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold tracking-wide hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Toggle Login Type */}
        <p className="text-center text-sm text-gray-600">
          {state === "Admin" ? (
            <>
              Doctor Login?{" "}
              <span
                onClick={() => setState("Doctor")}
                className="text-primary font-medium cursor-pointer hover:underline transition"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login?{" "}
              <span
                onClick={() => setState("Admin")}
                className="text-primary font-medium cursor-pointer hover:underline transition"
              >
                Click here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
