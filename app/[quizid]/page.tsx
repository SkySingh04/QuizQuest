'use client'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs , arrayUnion , addDoc , doc , updateDoc} from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import Firestore and auth
import {formatDateTime} from '../Date';
import toast from 'react-hot-toast';





// Define a type for your quiz question
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function Quiz() {
  

  
  const router = useRouter();
  const SearchParams = useSearchParams();
  const quizId : any = SearchParams.get('id')
  const quizName : any = SearchParams.get('name')
  const course : any = SearchParams.get('course')
  const courseCode : any = SearchParams.get('coursecode')
  const [user, setUser] = useState(null); // User authentication state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // Provide type annotation for questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);


  async function fetchQuizData() {
    let toReturn : any = null;
    const quizRef = collection(db, 'quizzes');
    const quizDoc = await getDocs(quizRef);
    if (quizDoc) {
      quizDoc.forEach((doc) => {
        const quizData = doc.data();
        const reqQuiz = quizData.data.id;
        if (reqQuiz == quizId) {
          console.log("found quiz")
          toReturn = quizData.data;
          // console.log(quizData.data)
        }
        else{
          console.log("not found")
        }
      }); 
      return toReturn  
    }
    else{
      return null
    }
    
  }

  
  useEffect(() => {
    // Check the user's authentication state
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setUser(user);
      } else {
        // Redirect unauthenticated users to the login page
        router.push('/login');
      }
    });

    
    // Fetch quiz questions from your data source (e.g., Firebase Firestore)
    // In this example, we're simulating questions using a local array
      async function fetchData() {
        const data = await fetchQuizData().then((data) => { return data });
        console.log(data.quizData)
        setQuestions(data.quizData);  
      }
      fetchData();
    
    // setQuestions(fetchedQuestions);
  }, []);
  

  useEffect(() => {
    setIsFinalQuestion(currentQuestionIndex === questions.length - 1);
  }, [currentQuestionIndex, questions]);

  const handleOptionSelect = (option: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentQuestionIndex] = option;
    setSelectedOptions(updatedOptions);
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] === questions[currentQuestionIndex].correctAnswer) {
      // Increase the score if the selected option is correct
      setScore((prevScore) => prevScore + 1);
    }
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }



    const handleQuizSubmit = async () => {
      console.log(`Quiz Completed! Your Score: ${score}/${questions.length}`);
      toast.success('Quiz Submitted Succesfully!');
  
      // Create an object with quiz results data
      
  
    // Get the user's UID from the authenticated user
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    let myScore = 0
    const correctAnswers = questions.map((question : any) => question.correctAnswer)
    for(let i = 0; i < selectedOptions.length; i++){
      if(selectedOptions[i] == correctAnswers[i]){
        console.log("correct")
        // setScore(score + 1)
        myScore = myScore + 1
      }
    }
    console.log(myScore)

    var d = new Date();
    var n = formatDateTime(d);
    const quizResults = {
      score : myScore,
      totalQuestions: questions.length,
      selectedOptions,
      correctAnswers: questions.map((question) => question.correctAnswer),
      fetchedQuestions: questions,
      quizId: quizId,
      quizName: quizName,
      course: course,
      courseCode: courseCode,
      time: n
    };

      try {
        // Create a reference to the user's document
        const userDocRef = doc(db, 'users', user.uid);

          await updateDoc(userDocRef as any, {
            quizData: arrayUnion(quizResults),
          });
        // Redirect to the results page
        router.push(`/results`);

    } catch (error) {
      console.error('Error storing quiz results:', error);
    }
  }
    
    // You can perform further actions, such as navigating to the results page.

  const currentQuestion = questions[currentQuestionIndex];

  

  return (
    <div className="min-h-screen flex items-center justify-center">
      {currentQuestion ? (
        <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg w-4/6 h-4/6">
          <h2 className="text-xl mb-4">Question {currentQuestionIndex + 1}:</h2>
          <p className="text-lg mb-4">{currentQuestion.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 text-lg cursor-pointer rounded-lg transition duration-300 ${
                  selectedOptions[currentQuestionIndex] === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-500'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            {currentQuestionIndex > 0 && (
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
                onClick={handlePreviousQuestion}
              >
                Previous
              </button>
            )}
            {isFinalQuestion ? (
              <button
                className="px-4 py-2 bg-blue-500 hover-bg-blue-700 text-white rounded-md"
                onClick={handleQuizSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 hover-bg-blue-700 text-white rounded-md"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default Quiz;
