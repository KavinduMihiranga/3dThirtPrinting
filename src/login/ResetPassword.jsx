import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Debug the URL first
  console.log("🔍 Full URL:", window.location.href);
  console.log("🔍 Location search:", location.search);

  // Extract the token value from the URL
  const urlParams = new URLSearchParams(location.search);
  let token = urlParams.get("token");

  console.log("🔍 Initial extracted token:", token);

  // FIX: If the token contains another URL, extract the inner token
  if (token && token.includes("reset-password?token=")) {
    console.log("🔄 Detected nested URL, extracting inner token...");
    const innerTokenMatch = token.match(/token=([^&]+)/);
    if (innerTokenMatch && innerTokenMatch[1]) {
      token = innerTokenMatch[1];
      console.log("🔍 Inner token extracted:", token);
    }
  }

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    console.log("🔍 Final token before sending:", token);

    if (!token) {
      setMessage("Invalid or expired reset link.");
      return;
    }

    // Additional validation to ensure we have a clean JWT token
    if (token.includes("http://") || token.includes("https://") || token.includes("localhost") || token.includes("reset-password")) {
      setMessage("Error: Invalid token format. Please check your reset link.");
      console.error("Token still contains URL elements:", token);
      return;
    }

    // Validate that it looks like a JWT token (three parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      setMessage("Error: Invalid token format. Please use the reset link from your email.");
      console.error("Token doesn't look like a JWT:", token);
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("✅ Sending clean JWT token to backend:", token);
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token: token,
        password: password,
      });

      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      console.error("❌ Reset error:", err.response?.data);
      setMessage(err.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>

        {message && (
          <div className={`p-3 mb-4 rounded-lg border ${
            message.includes("successful") 
              ? "bg-green-50 text-green-800 border-green-200" 
              : "bg-red-50 text-red-800 border-red-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter new password (min. 6 characters)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Confirm your new password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-teal-600 hover:text-teal-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}