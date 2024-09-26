import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleRegister = async (courseCode) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบ");
      navigate("/");
      return;
    }
    const confirmRegistration = window.confirm("คุณแน่ใจหรือว่าต้องการลงทะเบียนวิชานี้?");
    if (!confirmRegistration) {
      return; 
    }else{
        alert('ลงทะเบียนเรียบร้อยเเล้ว')
    }

    try {
      const response = await axios.post('http://localhost:3000/enroll/create', {
        course_code: courseCode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('ลงทะเบียนเรียบร้อยแล้ว!');
        const updatedCourses = await axios.get('http://localhost:3000/courses');
        setCourses(updatedCourses.data);
      } else {
        alert('มีข้อผิดพลาดเกิดขึ้นในการลงทะเบียน');
      }
    } catch (err) {
      console.log(err); 
    
    }
  };

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <StudentLayout>
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
                    <th scope="col" className="px-6 py-3">ที่นั่งทั้งหมด</th>
                    <th scope="col" className="px-6 py-3">ลงทะเบียนแล้ว</th>
                    <th scope="col" className="px-6 py-3 text-center">ลงทะเบียน</th>
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
                      <td className="px-6 py-4">{course.seat_limit}</td>
                      <td className="px-6 py-4">{course.current_enrollments}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          disabled={course.current_enrollments >= course.seat_limit}
                          onClick={() => handleRegister(course.course_code)}
                        >
                          {course.current_enrollments >= course.seat_limit ? 'เต็มแล้ว' : 'ลงทะเบียน'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      </StudentLayout>
    </div>
  );
};

export default CourseList;
