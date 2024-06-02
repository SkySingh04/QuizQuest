'use client'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs, arrayUnion, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { formatDateTime } from '../Date';
import toast from 'react-hot-toast';

// Define a type for your quiz question
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function Quiz() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId: any = searchParams.get('id');
  const quizName: any = searchParams.get('name');
  const course: any = searchParams.get('course');
  const courseCode: any = searchParams.get('coursecode');
  const [user, setUser] = useState(null); // User authentication state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // Provide type annotation for questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Time limit in seconds

  // Function to shuffle an array
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function fetchQuizData() {
    let toReturn: any = null;
    const quizRef = collection(db, 'quizzes');
    const quizDoc = await getDocs(quizRef);
    if (quizDoc) {
      quizDoc.forEach((doc) => {
        const quizData = doc.data();
        const reqQuiz = quizData.data.id;
        if (reqQuiz == quizId) {
          toReturn = quizData.data;
          // Shuffle options array for each question
          toReturn.quizData.forEach((question: QuizQuestion) => {
            shuffleArray(question.options);
          });
        }
      });
      return toReturn;
    } else {
      return null;
    }
  }

  // Update the useEffect hook where the timer is set
  useEffect(() => {
    let quizTime = 600000; // Default time if custom timer is not set
    async function setQuizTime() {
      const data = await fetchQuizData();
      if (data) {
        quizTime = data.customTimer * 1000; // Convert seconds to milliseconds
        setQuestions(data.quizData);
        setTimeLeft(quizTime / 1000); // Time limit in seconds
      }
    }

    setQuizTime();

    const timer = setTimeout(() => {
      setIsTimeUp(true);
    }, quizTime);

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000); // Decrease timeLeft by 1 every second

    // Clear the timer and the interval when the component unmounts or when the time is up
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isTimeUp) {
      console.log('Time is up!');
      toast.error('Time is up! Auto Submitting Quiz');
      handleQuizSubmit();
    }
  }, [isTimeUp]);

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

    async function fetchData() {
      const data = await fetchQuizData();
      if (data) {
        // Shuffle the questions before setting them in state
        shuffleArray(data.quizData);
        setQuestions(data.quizData);
      }
    }
    fetchData();
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
    const user = auth.currentUser;
    if (!user) {
      console.error('User not authenticated');
      toast.error("User not authenticated");
      return;
    }

    let myScore = 0;
    const correctAnswers = questions.map((question: any) => question.correctAnswer);

    // Check if all questions are attempted
    if (selectedOptions.length !== correctAnswers.length && !isTimeUp) {
      toast.error("Please attempt all of the questions");
      return;
    }

    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedOptions[i] == correctAnswers[i]) {
        myScore = myScore + 1;
      }
    }

    var d = new Date();
    var n = formatDateTime(d);
    const quizResults = {
      score: myScore,
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
      console.log(`Quiz Completed! Your Score: ${score}/${questions.length}`);
      toast.success('Quiz Submitted Successfully!');
      // Redirect to the results page
      router.push(`/results`);

    } catch (error) {
      console.error('Error storing quiz results:', error);
      toast.error('Error storing quiz results, Check Console');
    }
  }

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
                className={`p-4 text-lg cursor-pointer rounded-lg transition duration-300 ${selectedOptions[currentQuestionIndex] === option
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
            <div className=" bg-slate-600 text-white p-2 rounded-lg shadow-lg">
              Time left: {Math.floor(timeLeft / 60)} minutes {timeLeft % 60} seconds
            </div>
            {isFinalQuestion ? (
              <button
                className="px-4 py-2 bg-blue-500 hover-bg-blue-700 text-white rounded-md"
                onClick={handleQuizSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Quiz;
