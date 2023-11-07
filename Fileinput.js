import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";

function FileInput({ onFileUpload }) {
  const [excelData, setExcelData] = useState(null);
  const [quizInfo, setQuizInfo] = useState({
    quizName: "",
    course: "",
    courseCode: "",
  });

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const quizData = condenseExcelData(excelData);
      setExcelData(quizData);
      onFileUpload({ ...quizInfo, quizData });
    };

    reader.readAsBinaryString(file);
  };

  const condenseExcelData = (data) => {
    const quizData = [];
    for (let i = 1; i < data.length; i++) {
      const questionNumber = data[i][0];
      const question = data[i][1];
      const options = {
        a: data[i][2],
        b: data[i][3],
        c: data[i][4],
        d: data[i][5],
      };
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizInfo({
      ...quizInfo,
      [name]: value,
    });
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="file-input p-6 m-4 rounded-lg border-dashed border-2 border-gray-300 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-lg">Drag & drop an Excel file here, or click to select one</p>
      <div className="mt-4">
        <input
          type="text"
          name="quizName"
          value={quizInfo.quizName}
          placeholder="Quiz Name"
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          name="course"
          value={quizInfo.course}
          placeholder="Course"
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          name="courseCode"
          value={quizInfo.courseCode}
          placeholder="Course Code"
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
      </div>
      {excelData && (
        <div className="mt-4">
          <h2>Uploaded Quiz Data:</h2>
          <pre>{JSON.stringify({ ...quizInfo, quizData: excelData }, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FileInput;
