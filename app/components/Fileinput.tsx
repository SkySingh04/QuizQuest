import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from 'uuid';


interface FileInputProps {
  onFileUpload: (data: any) => void;
}

interface QuizInfo {
  quizName: string;
  course: string;
  courseCode: string;
  id: string;
}

interface QuizData {
  questionNumber: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

function FileInput({ onFileUpload  }: FileInputProps) {
  const [excelData, setExcelData] = useState (null);
  const [quizInfo, setQuizInfo] = useState({
    quizName: "",
    course: "",
    courseCode: "",
    id : uuidv4()
  } as QuizInfo);

  const onDrop = (acceptedFiles : any) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const quizData = condenseExcelData(excelData);
      setExcelData(quizData as any);
      onFileUpload({ ...quizInfo, quizData });
    };

    reader.readAsBinaryString(file);
  };

  const condenseExcelData = (data: any) => {
    const quizData: QuizData[] = [];
    for (let i = 1; i < data.length; i++) {
      const questionNumber = data[i][0];
      const question = data[i][1];
      const options = [data[i][2], data[i][3], data[i][4], data[i][5]]; // Store options in a list
      const correctAnswer = data[i][6];
      quizData.push({
        questionNumber,
        question,
        options,
        correctAnswer,
      });
    }
    
    return quizData;
  };

  const handleInputChange = (e : any) => {
    const { name, value } = e.target;
    setQuizInfo({
      ...quizInfo,
      [name]: value,
    });
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="h-screen flex flex-col items-center lg:mt-[70px] mt-[100px]">
      <div className="w-full max-w-md mt-4">
        <input
          type="text"
          name="quizName"
          value={quizInfo.quizName}
          placeholder="Quiz Name"
          onChange={handleInputChange}
          className="text-white w-full m-2 p-2 rounded"
        />
        <input
          type="text"
          name="course"
          value={quizInfo.course}
          placeholder="Course"
          onChange={handleInputChange}
          className="text-white w-full m-2 p-2 rounded"
        />
        <input
          type="text"
          name="courseCode"
          value={quizInfo.courseCode}
          placeholder="Course Code"
          onChange={handleInputChange}
          className="text-white w-full m-2 p-2 rounded"
        />
      </div>
      <h2 className="text-lg mt-4">Upload Excel File</h2>
      <div
        {...getRootProps()}
        className="file-input p-6 rounded-lg border-dashed border-2 border-gray-300 shadow-lg hover:shadow-xl cursor-pointer mt-4 w-1/2 h-1/6"
      >
        <input {...getInputProps()} />
        <p className="text-lg">Drag & drop an Excel file here, or click to select one</p>
      </div>
      {excelData && (
        <div className="mt-4">
          <h2 className="text-white">Successfully Generated Quiz!</h2>
        </div>
      )}
    </div>
  );
}

export default FileInput;
