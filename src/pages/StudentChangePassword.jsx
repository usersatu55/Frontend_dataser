import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../components/StudentLayout";

function StudentChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userConfirmed = window.confirm(
      "คุณแน่ใจว่าต้องการเปลี่ยนรหัสผ่านหรือไม่?"
    );
    if (!userConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:3000/student/update",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Password updated successfully!");
      setLoading(false);
      window.alert("รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว!");
      navigate("/StudentChangePassword");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Failed to update password");
    }
  };

  return (
    <div>
      <StudentLayout>
        <div className="flex justify-center py-8">
          <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              เปลี่ยนรหัสผ่าน
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-gray-700">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </form>
          </div>
        </div>
      </StudentLayout>
    </div>
  );
}

export default StudentChangePassword;
