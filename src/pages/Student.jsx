import { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';
import { Link } from 'react-router-dom'; 

function Student() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/enroll/by", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const courseData = response.data.Enrollments.map((enrollment) => ({
          course_code: enrollment.course_code,
          course_name: enrollment.course_name,
          instructor_name: `${enrollment.instructor_fname} ${enrollment.instructor_lname}`,
        }));
        setCourses(courseData);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถดึงข้อมูลรายวิชาได้');
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <StudentLayout>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-left mb-6">
            รายวิชาที่ลงทะเบียน
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div key={course.course_code} className="course-card">
                <h2 className="text-lg font-semibold">{course.course_name}</h2>
                <p>รหัสวิชา: {course.course_code}</p>
                <p>อาจารย์ผู้สอน: {course.instructor_name}</p>
                <div className="mt-4 text-center">
                  <Link
                    to={`/checkin/${course.course_code}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    เช็คชื่อ
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
      </StudentLayout>
    </div>
  );
}

export default Student;
