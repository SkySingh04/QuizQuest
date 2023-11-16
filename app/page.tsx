import React from 'react';
import Link from 'next/link';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Cards Section */}
      <div className="flex flex-wrap justify-center mt-8 md:space-x-[100px]">
        {/* Admin Card */}
        <Link href="/admin">
          <div className="card bg-gradient-to-r from-[#0F4C75] to-[#3282B8] admin-card hover:tilt items-center justify-center lg:h-[500px] lg:w-[500px]  text-white font-semibold px-6 py-4 rounded-md cursor-pointer hover:bg-blue-600 transition-transform duration-300">
            <h1 className="text-2xl mb-2">Admin Dashboard</h1>
            <h1>Manage quizzes and view user data.</h1>
          </div>
        </Link>

        {/* Student Card */}
        <Link href="/student">
          <div className="card bg-gradient-to-l from-[#0F4C75] to-[#3282B8] student-card hover1:tilt  items-center justify-center lg:h-[500px] lg:w-[500px]  bg-green-500 text-white font-semibold px-6 py-4 rounded-md cursor-pointer hover:bg-green-600 transition-transform duration-300">
            <h1 className="text-2xl mb-2">Student Dashboard</h1>
            <h1>Take quizzes and track your progress.</h1>
          </div>
        </Link>
      </div>

      
    </div>
  );
  
  
}
