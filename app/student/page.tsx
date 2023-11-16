'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from "../firebase";
import { db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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
// StudentPage component
const StudentPage = () => {
    const router = useRouter();

    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        // Check the user's authentication state
        onAuthStateChanged(auth, (user) => {
          if (user) {
            
            setUser(user as any);
          } else {
            // Redirect unauthenticated users to the login page
            router.push('/login');
          }
        });
      }, []);

  const [quizzes, setQuizzes] = useState([]);

  // Fetch quiz data from Firestore
  useEffect(() => {
    async function fetchData() {
      const data = await fetchQuizData();
      setQuizzes(data);
    }
    fetchData();
  }, []);
  console.log("quizzes are " + quizzes)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Quiz Cards Section */}
      <div className="mt-8 text-gray-300 text-center">
  <h1 className="text-3xl font-semibold mb-6">Join the quiz challenge and unlock your potential!</h1>
  <div className="flex flex-wrap justify-center mt-4">
    {quizzes.map((quiz: any) => (
      <Link key={quiz.data.id} href={`/quiz?id=${quiz.data.id}&name=${quiz.data.quizName}&course=${quiz.data.course}&coursecode=${quiz.data.courseCode}`}>
        <div className="bg-gradient-to-r from-customBlue to-customViolet font-black  px-6 py-4 rounded-md m-4 cursor-pointer transform hover:scale-105 transition duration-300">
          <div>
            <p className="text-lg">Quiz Name: {quiz.data.quizName}</p>
            <p>Course: {quiz.data.course}</p>
            <p>Course Code: {quiz.data.courseCode}</p>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>

    </div>
  );
};

export default StudentPage;
