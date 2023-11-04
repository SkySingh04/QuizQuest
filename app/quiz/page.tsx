'use client'
import React, { useState, useEffect } from 'react';
// Define a type for your quiz question
type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]); // Provide type annotation for questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fetch quiz questions from your data source (e.g., Firebase Firestore)
    // In this example, we're simulating questions using a local array
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
      // Add more questions
    ];

    setQuestions(fetchedQuestions);
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      // Increase the score if the selected option is correct
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // The quiz is completed
      // You can navigate to the results page or display the results
      // For simplicity, we'll just log the score
      console.log(`Quiz Completed! Your Score: ${score}/${questions.length}`);
    }
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h1>Quiz Page</h1>
      {currentQuestion ? (
        <div>
          <h2>Question {currentQuestionIndex + 1}:</h2>
          <p>{currentQuestion.question}</p>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li
                key={index}
                className={selectedOption === option ? 'selected' : ''}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
          <button onClick={handleNextQuestion}>Next</button>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default Quiz;
