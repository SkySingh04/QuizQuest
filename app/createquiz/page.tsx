'use client'
import React, { useState } from "react";
import FileInput from "../components/Fileinput"
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {db} from '../firebase';

function QuizGenerator() {
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = async (data : any)  => {
    setExcelData(data);
    const filteredQuizData = data.quizData.filter((entry : any) => {
      return (
        entry.questionNumber && // Ensure questionNumber is not null
        entry.question && // Ensure question is not null
        entry.options && // Ensure options is not null
        entry.correctAnswer // Ensure correctAnswer is not null
      );
    });
    
    // Update the original quizData object with the filtered data
    data.quizData = filteredQuizData;
    // console.log("data"  +  data);
    // console.log("excel  "  + excelData);
    if (data) {
      try {
        const quizCollection = collection(db, 'quizzes'); // 'quizzes' is the collection name
  
        // Add the quiz data to Firestore
        console.log(data)
        const docRef = await addDoc(quizCollection, {data});
  
        console.log('Quiz data added with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding quiz data: ', error);
      }
    }
  };
  

  // Implement quiz generation logic here using 'excelData'

  return (
    <div className="quiz-generator h-full"> 
      <FileInput onFileUpload={handleFileUpload} />
      {/* Display and configure the generated quiz here */}
      
    </div>
  );
}

export default QuizGenerator;
