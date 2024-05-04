'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from "../firebase";
import { db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

async function fetchQuizData() {
  const querySnapshot = await getDocs(collection(db, 'quizzes'));
  const quizData: any = [];
  querySnapshot.forEach((doc) => {
    if (!doc.data().data.isDeleted && !doc.data().data.isLocked) {
      quizData.push(doc.data());
    }
  });
  return quizData;
}

async function fetchUserData() {
  const userCollection = collection(db, 'users');
  const querySnapshot = await getDocs(userCollection);
  const userData: any = [];
  querySnapshot.forEach((doc) => {
    userData.push(doc.data());
  });
  const currentUserData = userData.filter((entry: any) => {
    return (
      entry.uid == auth.currentUser?.uid
    );
  });
  // console.log(currentUserData);
  return userData;
}

// StudentPage component
const StudentPage = () => {
  const router = useRouter();

  const [user, setUser] = useState(auth.currentUser);
  const [userData, setUserData] = useState([]);

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
      const userData = await fetchUserData();
      setQuizzes(data);
      setUserData(userData);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Quiz Cards Section */}
      <div className="mt-8 text-white text-center">
        <h1 className="text-3xl font-semibold mb-6">Join the quiz challenge and unlock your potential!</h1>
        <div className="flex flex-wrap justify-center mt-4">
          {quizzes.map((quiz: any) => {
            const userAttempts: any = userData.find(
              (data: any) => data.uid === auth.currentUser?.uid
            );

            const isQuizAttempted =
              userAttempts &&
              userAttempts.quizData.some((attempt: any) => attempt.quizId === quiz.data.id);

            return (
              <div
                key={quiz.data.id}
                className={`bg-gray-900 font-black px-6 py-4 rounded-md m-4 cursor-pointer transform hover:scale-105 hover:border-amber-400 border border-gray-900 transition duration-300 hoverEffect ${isQuizAttempted ? 'opacity-50' : ''
                  }`}
              >
                {isQuizAttempted ? (
                  <div>
                    <p className="text-lg">Quiz Name: {quiz.data.quizName}</p>
                    <p>Course: {quiz.data.course}</p>
                    <p>Course Code: {quiz.data.courseCode}</p>
                    <p>This quiz has been attempted.</p>
                  </div>
                ) : (
                  <Link
                    href={`/quiz?id=${quiz.data.id}&name=${quiz.data.quizName}&course=${quiz.data.course}&coursecode=${quiz.data.courseCode}`}
                  >
                    <div>
                      <p className="text-lg">Quiz Name: {quiz.data.quizName}</p>
                      <p>Course: {quiz.data.course}</p>
                      <p>Course Code: {quiz.data.courseCode}</p>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
