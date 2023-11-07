import React, { useState } from "react";
import FileInput from "./Fileinput"

function QuizGenerator() {
  const [excelData, setExcelData] = useState(null);

  const handleFileUpload = (data) => {
    setExcelData(data);
    console.log(data)
  };

  // Implement quiz generation logic here using 'excelData'

  return (
    <div className="quiz-generator">
      <h2>Quiz Generator</h2>
      <FileInput onFileUpload={handleFileUpload} />
      {/* Display and configure the generated quiz here */}
    </div>
  );
}

export default QuizGenerator;
