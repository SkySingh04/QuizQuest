'use client'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import QuizDetails from '../components/QuizDetails';
import {formatDate} from '../Date';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();
  const [userData, setUserData] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any>([]);

  useEffect(() => {
    fetchQuizData();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.providerData[0].email === 'admindsce@dsce.com' || user.providerData[0].email === 'testadmin@dsce.com') {
          setUser(user);
        } else {
          toast.error("Unauthorized :(");
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      fetchAdminData();
    });
  }, []);

  async function fetchAdminData() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const userDataArray: any = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === 'admindsce@dsce.com' || data.email === 'testadmin@dsce.com') {
          // Exclude admin user
        } else {
          userDataArray.push(data);
        }
      });
      setUserData(userDataArray);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  }

  async function fetchQuizData() {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const quizNameArray: any = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        quizNameArray.push(data.data.quizName)
      });
      setQuizData(quizNameArray);      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  }

  function calculateTotalScore(quizData: any) {
    let totalScore = 0;
    let totalQuestions = 0;

    quizData.forEach((quiz: any) => {
      totalScore += quiz.score;
      totalQuestions += quiz.totalQuestions;
    });

    return `${totalScore} / ${totalQuestions}`;
  }

  const handleDownloadExcel = () => {
    var d = new Date();
    var n = formatDate(d);
    // Flatten the userData array and include details for each quiz
    const flatData = userData.map(user => {
      const userFlat = {
        'User ID': user.uid,
        'USN': user.USN,
        'Email': user.email,
        'Student Name': user.displayName,
        'Total Score': calculateTotalScore(user.quizData),
        // Flatten quizData array
        ...user.quizData.reduce((acc : any, quiz : any, index : any) => ({
          ...acc,
          [` ${quiz.quizName} `]: `${quiz.score} / ${quiz.totalQuestions}`,
          [`${quiz.quizName} Time`]: quiz.time,
          [`${quiz.quizName} Quiz ID`]: quiz.quizId,
          [`${quiz.quizName} Course`]: quiz.course,
          [`${quiz.quizName} Course Code`]: quiz.courseCode,
        }), {}),
      };
      return userFlat;
    });
  
    // Create Excel sheet
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Student Data Sheet ${n}` );
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, `Student Data Sheet ${n} .xlsx`);
    
  };

  // Function to handle downloading individual quiz data
  const handleDownloadQuiz = (quizName : any) => {
    // Filter userData to get data for the specific quizName
    const quizData = userData.map(user => {
      const userQuiz = user.quizData.find((quiz: any) => quiz.quizName === quizName);
      return {
        'USN': user.USN,
        'Student Name': user.displayName,
        'Quiz Name': userQuiz ? userQuiz.quizName : '',
        'Score': userQuiz ? `${userQuiz.score} / ${userQuiz.totalQuestions}` : '',
        'Time': userQuiz ? userQuiz.time : '',
        'Course': userQuiz ? userQuiz.course : '',
        'Course Code': userQuiz ? userQuiz.courseCode : '',
      };
    }).filter(user => user['Quiz Name'] !== '');

    // Create Excel sheet for the specific quiz
    const ws = XLSX.utils.json_to_sheet(quizData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${quizName} Data`);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, `${quizName} Data.xlsx`);
    toast.success(`${quizName} Data Downloaded Successfully!`);
  };

  const saveAsExcelFile = (buffer: any, fileName: string) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className='  flex flex-col items-center justify-center  p-6 text-white min-h-screen my-[100px]'>
      <h1 className='text-3xl font-bold mb-6'>Admin Page</h1>
      <button
        onClick={handleDownloadExcel}
        disabled={userData.length === 0}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4`}
      >
        Download All Quiz Data
      </button>
      {/* Button for each quiz */}
      {userData.length > 0 && userData[0].quizData.length > 0 && (
        
      
        <div className="flex flex-wrap">
          {console.log(quizData)}
          {quizData.map((quiz:any, index: any) => (
            <button
              key={index}
              onClick={() => handleDownloadQuiz(quiz)}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 mr-4`}
            >
              Download {quiz} Data
            </button>
          ))}
        </div>
      )}
      <a
      href='/createquiz'
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded mb-4`}
      >
        Create Quiz
      </a>
      <table className='min-w-full  bg-gray-800 rounded-lg shadow-md mt-4'>
        <thead>
          <tr>
            <th className='border-b-2 p-4'>User ID</th>
            <th className='border-b-2 p-4'>USN</th>
            <th className='border-b-2 p-4'>Email</th>
            <th className='border-b-2 p-4'>Display Name</th>
            <th className='border-b-2 p-4'>Quiz Data</th>
            <th className='border-b-2 p-4'>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user: any) => (
            <tr key={user.uid} className='border-b-2'>
              <td className='p-4'>{user.uid}</td>
              <td className='p-4'>{user.USN}</td>
              <td className='p-4'>{user.email}</td>
              <td className='p-4'>{user.displayName}</td>
              <td className='p-4'>
                {user.quizData.map((quiz: any, index: any) => (
                  <div key={index} className='mb-4'>
                    <details className='mb-2'>
                      <summary className='text-xl font-semibold cursor-pointer'>
                        {quiz.quizName}: {quiz.score} / {quiz.totalQuestions}
                      </summary>
                      <QuizDetails quiz={quiz} />
                    </details>
                  </div>
                ))}
              </td>
              <td className='p-4'>{calculateTotalScore(user.quizData)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
