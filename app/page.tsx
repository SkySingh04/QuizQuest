import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-500 to-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Quiz App</h1>
      <p className="text-lg text-gray-200 mb-6">
        Test your knowledge and have fun learning with our interactive quizzes.
      </p>
      <Link href="/quiz" className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600">
          Get Started
      </Link>
      <div className="mt-8 text-gray-300 text-center">
        <p>Join the quiz challenge and unlock your potential!</p>
        <div className="flex flex-wrap justify-center mt-4">
          <div className="bg-black text-blue-600 font-semibold px-4 py-2 rounded-md m-2 cursor-pointer hover:bg-blue-200">
            Data Structure And Algorithms
          </div>
          <div className="bg-black text-blue-600 font-semibold px-4 py-2 rounded-md m-2 cursor-pointer hover:bg-blue-200">
            Object Oriented Programming
          </div>
          <div className="bg-black text-blue-600 font-semibold px-4 py-2 rounded-md m-2 cursor-pointer hover:bg-blue-200">
            Computer Organization And Architecture
          </div>
          <div className="bg-black text-blue-600 font-semibold px-4 py-2 rounded-md m-2 cursor-pointer hover:bg-blue-200">
            Data Modelling And Design
          </div>
          <div className="bg-black text-blue-600 font-semibold px-4 py-2 rounded-md m-2 cursor-pointer hover:bg-blue-200">
            Unix Shell Scripting
          </div>
        </div>
      </div>
    </div>
  );
}
