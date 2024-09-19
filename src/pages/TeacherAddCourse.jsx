import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarTeacher";
import axios from "axios";

import "../css/TeacherAddCourse.css";

function TeacherAddCourse() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [timeSlots, setTimeSlots] = useState([
    { day: "", start_time: "", end_time: "" },
  ]);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบ");
      navigate("/");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/courses/create",
        {
          course_code: courseCode,
          course_name: courseName,
          course_time_slots: timeSlots,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("สร้างคอร์สสำเร็จ");
    } catch (err) {
      console.error(err);
      alert("สร้างคอร์สไม่สำเร็จ");
    }
  };

  const handleSlotChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots[index][name] = value;
    setTimeSlots(updatedTimeSlots);
  };

  const addSlot = () => {
    setTimeSlots([...timeSlots, { day: "", start_time: "", end_time: "" }]);
  };

  const removeSlot = (index) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots.splice(index, 1);
    setTimeSlots(updatedTimeSlots);
  };

  return (
    
    <div class="flex justify-center py-10">
      <div class="w-full max-w-xl p-6 bg-white border border-gray-200 rounded-3xl shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <Navbar />

        <form class="space-y-6" onSubmit={handleSubmit}>
          <h1 class="font-bold text-center text-3xl  text-gray-900 dark:text-white">
            เพิ่มรายวิชา
          </h1>

          <div>
            <label
              for="courseCode"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              รหัสวิชา
            </label>
            <input
              type="text"
              id="courseCode"
              name="course_code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              for="courseName"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ชื่อวิชา
            </label>
            <input
              type="text"
              id="courseName"
              name="course_name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              เวลาเรียน
            </label>
            {timeSlots.map((slot, index) => (
              <div key={index} class="time-slot">
                <select
                  name="day"
                  value={slot.day}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={(e) => handleSlotChange(index, e)}
                  required
                >
                  <option value="">เลือกวัน</option>
                  <option value="วันจันทร์">วันจันทร์</option>
                  <option value="วันอังคาร">วันอังคาร</option>
                  <option value="วันพุธ">วันพุธ</option>
                  <option value="วันพฤหัสบดี">วันพฤหัสบดี</option>
                  <option value="วันศุกร์">วันศุกร์</option>
                  <option value="วันเสาร์">วันเสาร์</option>
                  <option value="วันอาทิตย์">วันอาทิตย์</option>
                </select>
                
                <div className="relative">
                  <div
                    className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 cursor-pointer"
                    onClick={() =>
                      document.getElementById(`start_time_${index}`).click()
                    }
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    id={`start_time_${index}`}
                    name="start_time"
                    value={slot.start_time}
                    onChange={(e) => handleSlotChange(index, e)}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pe-10 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div className="relative">
                  <div
                    className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 cursor-pointer"
                    onClick={() =>
                      document.getElementById(`end_time_${index}`).click()
                    }
                  >
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="time"
                    id={`end_time_${index}`}
                    name="end_time"
                    value={slot.end_time}
                    onChange={(e) => handleSlotChange(index, e)}
                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pe-10 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-3.5 py-2 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  ลบ
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addSlot}
              class="w-full text-gray-900 bg-white border border-solid border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              เพิ่มเวลาเรียน
            </button>
          </div>

          <button
            type="submit"
            class="w-full text-white bg-blue-700 border border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:border-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            สร้างคอร์ส
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherAddCourse;
