import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

function AttenStat() {
  const { course_code } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/atten/byc`, {
          params: { course_code, status },
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
  }, [course_code, status]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const toggleStatus = (index) => {
    setAttendance((prevAttendance) => {
      const newAttendance = [...prevAttendance];
      const currentStatus = newAttendance[index].status;

      if (currentStatus === "present") {
        newAttendance[index].status = "late";
      } else if (currentStatus === "late") {
        newAttendance[index].status = "absent";
      } else if (currentStatus === "absent") {
        newAttendance[index].status = "leave";
      } else {
        newAttendance[index].status = "present";
      }

      return newAttendance;
    });
  };

  const renderStatusCircle = (status, index) => {
    let bgColor;
    switch (status) {
      case "present":
        bgColor = "bg-green-500";
        break;
      case "late":
        bgColor = "bg-orange-500";
        break;
      case "absent":
        bgColor = "bg-red-500";
        break;
      case "leave":
        bgColor = "bg-blue-500";
        break;
      default:
        bgColor = "bg-gray-300";
    }

    return (
      <button
        className={`inline-block w-4 h-4 ${bgColor} rounded-full`}
        onClick={() => toggleStatus(index)}
      />
    );
  };
  return (
    <div>
      <Navbar />

      <div className="flex justify-center py-8">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            สถิติการเข้าเรียน
          </h1>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
            <h2 className="text-xl font-semibold pb-8">
              รายวิชา: {course_code} {courseName}
            </h2>

            <div className="relative overflow-x-auto  sm:rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-center text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ลำดับ
                    </th>
                    <th scope="col" className="px-6 py-3">
                      รหัสนักศึกษา
                    </th>
                    <th scope="col" className="px-6 py-3">
                      ชื่อ-นามสกุล
                    </th>
                    <th scope="col" className="px-6 py-3">
                      1/09/24
                    </th>
                    <th scope="col" className="px-6 py-3">
                      8/09/24
                    </th>
                    <th scope="col" className="px-6 py-3">
                      19/09/24
                    </th>
                    <th scope="col" className="px-6 py-3">
                      30/09/24
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
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {index + 1}
                        </td>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {student.student_id}
                        </th>
                        <td className="px-6 py-4">
                          {student.student_fname} {student.studnet_lname}
                        </td>
                        <td className="px-6 py-4 ">
                          {renderStatusCircle(student.status)}
                        </td>
                        <td className="px-6 py-4 ">
                          {renderStatusCircle(student.status)}
                        </td>
                        <td className="px-6 py-4 ">
                          {renderStatusCircle(student.status)}
                        </td>
                        <td className="px-6 py-4 ">
                          {renderStatusCircle(student.status)}
                        </td>
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
    </div>
  );
}

export default AttenStat;
