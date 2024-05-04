import React from 'react';
import { FaUserCog, FaUserGraduate } from 'react-icons/fa'; // Import icons from Font Awesome
import Link from 'next/link';
import styles from './Home.module.css'; // Import CSS file for styling

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Cards Section */}
      <div className="flex flex-wrap items-center justify-center mt-8 md:space-x-[100px]">
        {/* Admin Card */}
        <Link href="/admin">
          <div className={`card bg-gray-900 mx-6 admin-card items-center justify-center lg:h-[300px] lg:w-[500px] text-white font-semibold px-6 py-4 rounded-md cursor-pointer transition-transform duration-300 ${styles.hoverEffect}`}>
            <FaUserCog className="text-4xl mb-4" /> {/* Font Awesome icon */}
            <h1 className="text-2xl mb-2">Admin Dashboard</h1>
            <h1>Manage quizzes and view user data.</h1>
          </div>
        </Link>

        {/* Student Card */}
        <Link href="/student">
          <div className={`card bg-gray-900 mx-6 student-card items-center justify-center lg:h-[300px] lg:w-[500px]  text-white font-semibold px-6 py-4 rounded-md cursor-pointer transition-transform duration-300 ${styles.hoverEffect}`}>
            <FaUserGraduate className="text-4xl mb-4" /> {/* Font Awesome icon */}
            <h1 className="text-2xl mb-2">Student Dashboard</h1>
            <h1>Take quizzes and track your progress.</h1>
          </div>
        </Link>
      </div>
    </div>
  );
}
