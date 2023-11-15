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
        <h1>Join the quiz challenge and unlock your potential!</h1>
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
        
      </div>
    </div>
  );
};

export default StudentPage;
