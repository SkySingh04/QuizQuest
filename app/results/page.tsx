'use client';
import React from 'react';
import { collection, getDocs} from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import Firestore and auth
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();  
  const [quizResults, setQuizResults] = useState <any>([]);
  const [user, setUser] = useState(auth.currentUser);
  const [score, setScore] = useState(0);
  const [questionlength, setQuestionlength] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);


  async function fetchQuizResults(){
    const user = auth.currentUser
    const user_id = user?.uid
      const querySnapshot = await getDocs(collection(db , 'users'));
      querySnapshot.forEach((doc) => {
        if(doc.id == user_id){
        // doc.data() is never undefined for query doc snapshots
        setQuizResults(doc.data() as any)
        const quizData = doc.data().quizData
        const lastQuiz = quizData[quizData.length - 1];
        // const quizScore = lastQuiz.score;
        // setScore(quizScore)
        const questionLength = lastQuiz.totalQuestions
        setQuestionlength(questionLength)
        // const quizQuestions = lastQuiz.questions;
        // setQuestionlength(quizQuestions.totalQuestions)
        const quizSelectedOptions = lastQuiz.selectedOptions;
        setSelectedOptions(quizSelectedOptions)
        const quizCorrectAnswers = lastQuiz.correctAnswers;
        setCorrectAnswers(quizCorrectAnswers)
        const quizScore = lastQuiz.score;
        setScore(quizScore)
        const quizFetchedQuestions = lastQuiz.fetchedQuestions;
        setFetchedQuestions(quizFetchedQuestions)
      }});
      
 }
  // User authentication state
  useEffect(() => {
    // Check the user's authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        
        setUser(user as any);
        fetchQuizResults();
      } else {
        // Redirect unauthenticated users to the login page
        router.push('/login');
      }
    });
  }, []);
  // Retrieve user details
  const displayName = user?.providerData[0].displayName ;



  return (
    <div className=" min-h-screen flex flex-col items-center justify-center py-4 my-14">
      <div className=" p-8 rounded-md shadow-md w-4/5 lg:w-3/5 bg-customViolet">
        <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
        <p className="text-xl text-white">
          User: {displayName || 'User Not Found'}
        </p>
        <p className="text-xl text-white">
          Score: {score}/{questionlength || 'Score Not Found'}
        </p>


        {fetchedQuestions.map((question:any, index : any) => (
          <div key={index} className="my-6 rounded-md shadow-md bg-[#0F4C75]  p-2">
            <h2 className="text-lg font-semibold mb-2">Question {index + 1}:</h2>
            <p className="text-base mb-2 text-white">{question.question}</p>
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
                      : 'bg-gray-600'
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
