'use client'
import React, { useState } from "react";
import FileInput from "../components/Fileinput"

function QuizGenerator() {
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (data : any) => {
    setExcelData(data);
    console.log(data)
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
