'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import {db} from "../app/firebase"; // Import your Firestore instance

// Define a function to fetch quiz data
async function fetchQuizData() {
  const quizCollection = collection(db, 'quizzes');
  const querySnapshot = await getDocs(quizCollection);
  const quizData:any = [];
  querySnapshot.forEach((doc) => {
    quizData.push(doc.data());
  });
  console.log(quizData);
  return quizData;
}

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);

  // Fetch quiz data from Firestore
  useEffect(() => {
    async function fetchData() {
      const data = await fetchQuizData();
      setQuizzes(data);
    }
    fetchData();
  }, []);
  // console.log("quizzes are " + quizzes)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Cards Section */}
      <div className="flex flex-wrap justify-center mt-8 space-x-[100px]">
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

      {/* <div className="mt-8 text-gray-300 text-center">
        <h1>Join the quiz challenge and unlock your potential!</p>
        <div className="flex flex-wrap justify-center mt-4">
          {quizzes.map((quiz : any) => (
            <Link href={`/quiz?id=${quiz.data.id}&name=${quiz.data.quizName}&course=${quiz.data.course}&coursecode=${quiz.data.courseCode}`}>
            <div
              key={quiz.data.id} // Assuming you have an "id" field in your quiz data
              className="bg-black text-blue-600 font-semibold px-4 py-2 rounded-md m-2 cursor-pointer hover:bg-blue-200"
            >
              <div>
                <strong>Quiz Name:</strong> {quiz.data.quizName}
              </div>
              <div>
                <strong>Course:</strong> {quiz.data.course}
              </div>
              <div>
                <strong>Course Code:</strong> {quiz.data.courseCode}
              </div>
            </div>
            </Link>
          ))}
        </div>
        
      </div> */}
    </div>
  );
  
  
}
