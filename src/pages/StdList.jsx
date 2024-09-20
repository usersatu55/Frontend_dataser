import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; 
import Layout from '../components/TeacherLayout';

function StdList() {
  const { course_code } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/atten/byc`, {
          params: { 
            course_code, 
            status, 
            day: day || undefined, 
            month: month || undefined, 
            year: year || undefined 
          },
        });
  
        if (response.data.Attendance.length > 0) {
          setAttendance(response.data.Attendance);
          setCourseName(response.data.Attendance[1].course_name); 
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

  const goToEnrolledStudents = () => {
    navigate(`/enrollments/${course_code}`);
  };
  

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  

  return (
    <div>
  <Layout>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            สถานะการเข้าเรียนล่าสุด
          </h1>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 ">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <select
                value={status}
                onChange={handleStatusChange}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xs px-3 py-1.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                <option value="">ทั้งหมด</option>
                <option value="เข้าเรียน">เข้าเรียน</option>
                <option value="ขาดเรียน">ขาดเรียน</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={goToEnrolledStudents}
                type="button"
                className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-1.5 me-2 mb-2 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                รายชื่อนักศึกษา
              </button>

              <div>
                <input
                  type="text"
                  placeholder="วัน"
                  value={day}
                  onChange={handleDayChange}
                  className="border py-0.5 me-1  pe-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="เดือน"
                  value={month}
                  onChange={handleMonthChange}
                  className="border py-0.5 me-1 bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="ปี พ.ศ."
                  value={year}
                  onChange={handleYearChange}
                  className="border py-0.5 me-1  bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold pb-8">
              รายวิชา: {course_code} {courseName}
            </h2>

            <div className="relative overflow-x-auto sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                    <th scope="col" className="px-6 py-3">
                      อีเมล
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((student, index) => {
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
                            className={`${
                              student.status === "เข้าเรียน"
                                ? "bg-green-100 text-green-900 dark:bg-red-900 dark:text-red-300"
                                : "bg-red-100 text-red-900 dark:bg-green-900 dark:text-green-300"
                            } text-xs font-medium me-2 px-2.5 py-0.5 rounded-full`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{student.email}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </div>
      </Layout>
    </div>
  );
}

export default StdList;
