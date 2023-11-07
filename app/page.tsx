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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-500 to-gray-900">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Quiz App</h1>
      <p className="text-lg text-gray-200 mb-6">
        Test your knowledge and have fun learning with our interactive quizzes.
      </p>
      <Link href="/createquiz" className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600">
        Create Quiz!
      </Link>
      <div className="mt-8 text-gray-300 text-center">
        <p>Join the quiz challenge and unlock your potential!</p>
        <div className="flex flex-wrap justify-center mt-4">
          {quizzes.map((quiz : any) => (
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
          ))}
        </div>
      </div>
    </div>
  );
  
  
}
