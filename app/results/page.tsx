'use client';
import React from 'react';
import auth from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(auth.currentUser); // User authentication state
  useEffect(() => {
    // Check the user's authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Redirect unauthenticated users to the login page
        router.push('/login');
      }
    });
  }, []);

  // Retrieve user details
  const displayName = user?.providerData[0].displayName;

  // Retrieve score and other data from local storage
  const storedScore = localStorage.getItem('quizScore');
  const questionlength = localStorage.getItem('questionlength');
  const selectedOptions = JSON.parse(localStorage.getItem('selectedOptions') || '[]');
  const correctAnswers = JSON.parse(localStorage.getItem('correctAnswers') || '[]');
  const fetchedQuestions = JSON.parse(localStorage.getItem('fetchedQuestions') || '[]');

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center py-4 my-10">
      <div className=" p-8 rounded-md shadow-md w-4/5 lg:w-3/5">
        <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
        <p className="text-xl">
          User: {displayName || 'User Not Found'}
        </p>
        <p className="text-xl">
          Score: {storedScore}/{questionlength || 'Score Not Found'}
        </p>

        {fetchedQuestions.map((question:any, index : any) => (
          <div key={index} className="my-6">
            <h2 className="text-lg font-semibold mb-2">Question {index + 1}:</h2>
            <p className="text-base mb-2">{question.question}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {question.options.map((option:any, optionIndex:any) => (
                <div
                  key={optionIndex}
                  className={`p-4 rounded-md shadow-md transition duration-300 ${
                    selectedOptions &&
                    selectedOptions[index] === option &&
                    selectedOptions[index] === correctAnswers[index]
                      ? 'bg-green-400'
                      : selectedOptions &&
                        selectedOptions[index] === option
                      ? 'bg-red-400'
                      : 'bg-gray-400'
                  }`}
                >
                  <div>
                    {selectedOptions && selectedOptions[index] === option ? (
                      selectedOptions[index] === correctAnswers[index] ? (
                        <span className="text-green-500">✓ </span>
                      ) : (
                        <span className="text-red-500">✗ </span>
                      )
                    ) : null}
                    {option}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
