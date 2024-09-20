import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavbarTeacher";

function EnrolledStudentsList() {
  const { course_code } = useParams();
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/enroll/byc`, {
          params: { course_code },
        });

        if (response.data.Enrollments.length > 0) {
          setEnrolledStudents(response.data.Enrollments);
        } else {
          setEnrolledStudents([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch enrolled students");
      }
    };

    fetchEnrolledStudents();
  }, [course_code]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
            รายชื่อนักศึกษาที่ลงทะเบียน
          </h1>
          <div className="relative overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสนักศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หลักสูตร
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    e-mail
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolledStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.student_fname} {student.student_lname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.student_email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EnrolledStudentsList;
