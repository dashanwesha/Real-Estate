import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../../redux/user/userSlice";
import GoogleAuth from "../components/GoogleAuth"; // Ensure this path is correct

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState(""); // Local error state
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(""); // Reset local error before making the request

    try {
      dispatch(signInStart()); // Dispatch action to set loading state
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log('Response:', res); // Log response for debugging

      if (!res.ok) {
        const errorData = await res.json();
        setLocalError(errorData.message || "Failed to sign in");
        dispatch(signInFailure(errorData.message || "Failed to sign in")); // Dispatch action on sign-in failure
        return;
      }

      const data = await res.json();

      console.log('Response Data:', data); // Log response data for debugging

      if (data.success === false) {
        setLocalError(data.message); // Set local error message
        dispatch(signInFailure(data.message)); // Dispatch action on sign-in failure
        return;
      }

      dispatch(signInSuccess(data)); // Dispatch action on successful sign-in
      navigate("/"); // Redirect to home page after successful sign-in
    } catch (error) {
      console.error('Sign-in Error:', error); // Log error for debugging
      setLocalError(error.message); // Set local error message
      dispatch(signInFailure(error.message)); // Dispatch action on error during sign-in
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign In</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-lg border"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <GoogleAuth /> {/* Ensure this component is correctly imported */}
      </form>

      {localError && <p className="text-red-500 mt-4">{localError}</p>} {/* Display local error */}

      <div className="flex gap-2 mt-5">
        <p className="mr-2">Don't have an account?</p>
        <Link to="/sign-up" className="text-blue-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
