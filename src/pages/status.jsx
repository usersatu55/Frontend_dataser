import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/StudentLayout";

function Status() {
  const { course_code } = useParams(); // Get course_code from URL parameter
  const [attendance, setAttendance] = useState([]); // Attendance status
  const [courseName, setCourseName] = useState(""); // Course name
  const [error, setError] = useState(null); // Error state
  const [status, setStatus] = useState(""); // Attendance status (attended/absent)
  const [day, setDay] = useState(""); // Day
  const [month, setMonth] = useState(""); // Month
  const [year, setYear] = useState(""); // Year

  const dateParams = { day, month, year }; // Combine date parameters

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await axios.get("http://localhost:3000/atten/by", {
          params: { course_code, status, day, month, year },
          headers: { Authorization: `Bearer ${token}` }, // Send token in headers
        });

        if (response.data.Attendance && response.data.Attendance.length > 0) {
          setAttendance(response.data.Attendance); // Set attendance data
          setCourseName(response.data.Attendance[0].course_name); // Set course name
        } else {
          setAttendance([]); // No data
          setCourseName(""); // Reset course name
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch attendance"); // Error fetching data
      }
    };

    fetchAttendance(); // Call the fetch function
  }, [course_code, status, dateParams]); // Runs when these values change

  // Handle change for status and date inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStatus(value);
    } else if (name === "day") {
      setDay(value);
    } else if (name === "month") {
      setMonth(value);
    } else if (name === "year") {
      setYear(value);
    }
  };

  return (
    <div>
      <StudentLayout>
        <div className="flex justify-center py-8">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-center mb-6">
              ตรวจสอบสถานะการเข้าเรียน
            </h1>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
              <div className="flex flex-wrap justify-between pb-4 gap-4">
                {/* Status Filter */}
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xs px-3 py-1.5"
                >
                  <option value="">ทั้งหมด</option>
                  <option value="เข้าเรียน">เข้าเรียน</option>
                  <option value="ขาดเรียน">ขาดเรียน</option>
                </select>

                {/* Date Inputs */}
                <input
                  type="text"
                  value={day}
                  onChange={handleDayChange}
                  placeholder="วัน"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xs px-2 py-1.5"
                />
                <input
                  type="text"
                  value={month}
                  onChange={handleMonthChange}
                  placeholder="เดือน"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xs px-2 py-1.5"
                />
                <input
                  type="text"
                  value={year}
                  onChange={handleYearChange}
                  placeholder="ปี"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xs px- py-1.5"
                />
              </div>

              {/* Course Name */}
              <h2 className="text-xl font-semibold pb-8">
                รายวิชา: {course_code} {courseName}
              </h2>

              {/* Attendance Table */}
              <div className="relative overflow-x-auto sm:rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        รหัสนักศึกษา
                      </th>
                      <th scope="col" className="px-6 py-3">
                        ชื่อ-นามสกุล
                      </th>
                      <th scope="col" className="px-6 py-3">
                        เวลา
                      </th>
                      <th scope="col" className="px-6 py-3">
                        วันที่
                      </th>
                      <th scope="col" className="px-6 py-3">
                        สถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length > 0 ? (
                      attendance.map((student, index) => {
                        const date = new Date(student.date);
                        const time = date.toLocaleTimeString();
                        const formattedDate = date.toLocaleDateString();

                        return (
                          <tr
                            key={index}
                            className="bg-white text-center border-b"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900"
                            >
                              {student.student_id}
                            </th>
                            <td className="px-6 py-4">
                              {student.student_fname} {student.student_lname}
                            </td>
                            <td className="px-6 py-4">{time}</td>
                            <td className="px-6 py-4">{formattedDate}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                  student.status === "เข้าเรียน"
                                    ? "bg-green-100 text-green-800"
                                    : student.status === "ขาดเรียน"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center text-gray-500 py-4"
                        >
                          ไม่มีข้อมูลการเช็คชื่อ
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <input
              type="text"
              name="day"
              placeholder="วัน"
              value={day}
              onChange={handleChange}
              className="border py-0.5 me-1 pe-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
            <input
              type="text"
              name="month"
              placeholder="เดือน"
              value={month}
              onChange={handleChange}
              className="border py-0.5 me-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
            <input
              type="text"
              name="year"
              placeholder="ปี พ.ศ."
              value={year}
              onChange={handleChange}
              className="border py-0.5 me-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <h2 className="text-xl font-semibold pb-8">
            รายวิชา: {course_code} {courseName}
          </h2>

          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">รหัสนักศึกษา</th>
                  <th scope="col" className="px-6 py-3">ชื่อ-นามสกุล</th>
                  <th scope="col" className="px-6 py-3">เวลา</th>
                  <th scope="col" className="px-6 py-3">วันที่</th>
                  <th scope="col" className="px-6 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((student, index) => {
                    const date = new Date(student.date);
                    return (
                      <tr key={index} className="bg-white text-center border-b">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900">{student.student_id}</th>
                        <td className="px-6 py-4">{student.student_fname} {student.student_lname}</td>
                        <td className="px-6 py-4">{date.toLocaleTimeString()}</td>
                        <td className="px-6 py-4">{date.toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`bg-${student.status === "เข้าเรียน" ? "green" : "red"}-100 text-${student.status === "เข้าเรียน" ? "green" : "red"}-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      ไม่มีข้อมูลการเช็คชื่อ {/* No attendance data */}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>} {/* Show error */}
        </div>
      </StudentLayout>
    </div>
  );
}

export default Status;
