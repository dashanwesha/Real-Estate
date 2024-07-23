import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData); // Log form data for debugging
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data); // Log API response for debugging
      if (data.message === "User created successfully") {
        setLoading(false);
        setError(null);
        navigate("/sign-in");
      } else if (data.message === "User already exists") {
        setLoading(false);
        setError("User already exists");
      } else {
        setLoading(false);
        setError("Unexpected error occurred");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign Up</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="p-3 rounded-lg border"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded-lg border"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded-lg border"
          id="password"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 disabled:opacity-80 w-full"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>

      <div className="my-4 flex items-center justify-center w-full">
        <GoogleAuth />
      </div>

      <div className="flex gap-2 mt-5 justify-center">
        <p className="mr-2">Have an account?</p>
        <Link to="/sign-in" className="text-blue-700">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
