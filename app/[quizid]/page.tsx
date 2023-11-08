'use client'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import {auth} from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {db} from "../firebase"; // Import your Firestore instance




// Define a type for your quiz question
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function Quiz() {
  

  
  const router = useRouter();
  const SearchParams = useSearchParams();
  const id : any = SearchParams.get('id')
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
        if (reqQuiz == id) {
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

      
  const fetchedQuestions: QuizQuestion[] = [
    {
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 'Paris',
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Mars', 'Venus', 'Jupiter', 'Earth'],
      correctAnswer: 'Jupiter',
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Mars', 'Venus', 'Jupiter', 'Earth'],
      correctAnswer: 'Jupiter',
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Mars', 'Venus', 'Jupiter', 'Earth'],
      correctAnswer: 'Jupiter',
    },
    // Add more questions
  ];
  
  
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
      setScore(score + 1);
      console.log(score)
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

  const handleQuizSubmit = () => {
    console.log(`Quiz Completed! Your Score: ${score}/${questions.length}`);
    localStorage.setItem('quizScore', score.toString());
    localStorage.setItem('questionlength', questions.length.toString());
    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    const correctAnswers = questions.map((question) => question.correctAnswer);
    localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
    localStorage.setItem('fetchedQuestions', JSON.stringify(fetchedQuestions));
    router.push(`/results`);
  
    
    // You can perform further actions, such as navigating to the results page.
  }

  const currentQuestion = questions[currentQuestionIndex];

  

  return (
    <div className="min-h-screen flex items-center justify-center">
      {currentQuestion ? (
        <div className="bg-base-300 p-8 rounded-lg shadow-lg w-4/6 h-4/6">
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
