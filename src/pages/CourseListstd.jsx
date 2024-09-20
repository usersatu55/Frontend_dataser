import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import axios from 'axios';

function CourseListstd() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/enroll/by', {
          headers: { Authorization: `Bearer ${token}` },
        });

       
        const courseData = response.data.Enrollments.map((enrollment) => ({
          course_code: enrollment.course_code,
          course_name: enrollment.course_name,
          instructor_name: `${enrollment.instructor_fname} ${enrollment.instructor_lname}`,
          course_time_slots: enrollment.course_time_slots,
        }));

        setCourses(courseData);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch courses');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center py-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-left mb-6">รายวิชาทั้งหมด</h1>

          <div className="relative overflow-x-auto sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">ลำดับ</th>
                  <th scope="col" className="px-6 py-3">รหัสวิชา</th>
                  <th scope="col" className="px-6 py-3">ชื่อวิชา</th>
                  <th scope="col" className="px-6 py-3">วันและเวลาเรียน</th>
                  <th scope="col" className="px-6 py-3 text-center">ตรวจสอบสถานะ</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr
                    key={course.course_code}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{course.course_code}</td>
                    <td className="px-6 py-4">{course.course_name}</td>
                    <td className="px-6 py-4">
                      {course.course_time_slots && course.course_time_slots.map((slot, idx) => (
                        <div key={idx}>
                          {slot.day}: {slot.start_time} - {slot.end_time}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/status/${course.course_code}`}  
                        className="text-green-600 hover:text-green-800"
                      >
                        ตรวจสอบการเช็คชื่อ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default CourseListstd;
