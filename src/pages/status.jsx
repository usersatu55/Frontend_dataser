import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StudentLayout from "../components/StudentLayout";

function Status() {
  const { course_code } = useParams(); // Extract course_code from URL parameters
  const [attendance, setAttendance] = useState([]); // Attendance status
  const [courseName, setCourseName] = useState(""); // Course name
  const [error, setError] = useState(null); // Error handling
  const [status, setStatus] = useState(""); // Attendance status filter
  const [day, setDay] = useState(""); // Day filter
  const [month, setMonth] = useState(""); // Month filter
  const [year, setYear] = useState(""); // Year filter

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          setError('No token found');
          return;
        }

        const response = await axios.get('http://localhost:3000/atten/by', {
          params: { course_code, status, day, month, year },
          headers: { Authorization: `Bearer ${token}` }, // Send token in headers
        });

        if (response.data.Attendance && response.data.Attendance.length > 0) {
          setAttendance(response.data.Attendance); // Store attendance data
          setCourseName(response.data.Attendance[0].course_name); // Store course name
        } else {
          setAttendance([]);
          setCourseName("");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch attendance");
      }
    };

    fetchAttendance();
  }, [course_code, status, day, month, year]);

  // Handlers for input changes
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleDayChange = (e) => setDay(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

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
                      const time = date.toLocaleTimeString();
                      const formattedDate = date.toLocaleDateString();

                      return (
                        <tr key={index} className="bg-white text-center border-b">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900">
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
                      <td colSpan="5" className="text-center text-gray-500 py-4">
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
      </div></StudentLayout>
    </div>
  );
}

export default Status;
