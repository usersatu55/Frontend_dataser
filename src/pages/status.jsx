import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Status() {
  const { course_code } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          return;
        }
        
        // เรียก API localhost:3000/atten/by โดยส่งค่า course_code และ status
        const response = await axios.get('http://localhost:3000/atten/by', {
          params: { course_code, status },
          headers: { Authorization: `Bearer ${token}` }, // ส่ง token เพื่อยืนยันตัวตน
        });

        if (response.data.Attendance && response.data.Attendance.length > 0) {
          setAttendance(response.data.Attendance);
          setCourseName(response.data.Attendance[0].course_name); 
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
  }, [course_code, status]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div>
      <Navbar />

      <div className="flex justify-center py-8">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            ตรวจสอบสถานะการเข้าเรียน
          </h1>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
            <div className="flex justify-between pb-4">
              <select
                value={status}
                onChange={handleStatusChange}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="">ทั้งหมด</option>
                <option value="เข้าเรียน">เข้าเรียน</option>
                <option value="ขาดเรียน">ขาดเรียน</option>
              </select>
            </div>

            <h2 className="text-xl font-semibold pb-8">
              รายวิชา: {course_code} {courseName}
            </h2>

            <div className="relative overflow-x-auto sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">รหัสนักศึกษา</th>
                    <th scope="col" className="px-6 py-3">ชื่อ-นามสกุล</th>
                    <th scope="col" className="px-6 py-3">เวลา</th>
                    <th scope="col" className="px-6 py-3">วันที่</th>
                    <th scope="col" className="px-6 py-3">สถานะ</th>
                    <th scope="col" className="px-6 py-3">อีเมล</th>
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
                          className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
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
                              className={
                                student.status === "เข้าเรียน"
                                  ? "bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                                  : student.status === "ขาดเรียน"
                                  ? "bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
                                  : "bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300"
                              }
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">{student.email}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 py-4">
                        ไม่มีข้อมูลการเช็คชื่อ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Status;
