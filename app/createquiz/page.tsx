'use client'
import React, { useState  , useEffect} from "react";
import FileInput from "../components/Fileinput"
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {db} from '../firebase';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function QuizGenerator() {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();
  // User authentication state
  useEffect(() => {
    // Check the user's authentication state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.providerData[0].email)
        if (user.providerData[0].email === 'admindsce@dsce.com' || user.providerData[0].email === 'testadmin@dsce.com'){
        setUser(user as any);
      }
      else{
        alert("Unauthorized :(")
        router.push('/login');
      }
       }
      
      else {
        // Redirect unauthenticated users to the login page
        router.push('/login');
      }
    });
  }, []);


  const handleFileUpload = async (data : any)  => {
    setExcelData(data);
    setFileName(data.fileName);
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
        toast.success("Quiz added successfully");
  
        console.log('Quiz data added with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding quiz data: ', error);
        toast.error("Quiz addition failed");
      }
    }
  };

  return (
    <div className="quiz-generator h-full"> 
      <FileInput onFileUpload={handleFileUpload} />
      {fileName && <p>Uploaded File: {fileName}</p>}
      {/* Display and configure the generated quiz here */}
    </div>
  );
}

export default QuizGenerator;
