'use client'
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

const AdminPage = () => {
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.providerData[0].email === 'admindsce@dsce.com') {
          setUser(user);
        } else {
          alert('Unauthorized :(');
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
        if (data.email === 'admindsce@dsce.com') {
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

  function calculateTotalScore(quizData: any) {
    let totalScore = 0;
    let totalQuestions = 0;

    quizData.forEach((quiz: any) => {
      totalScore += quiz.score;
      totalQuestions += quiz.totalQuestions;
    });

    return `${totalScore} / ${totalQuestions}`;
  }

  const handleDownloadPDF = () => {
    const doc: any = new jsPDF();

    doc.text('User Data', 10, 10);

    const tableData = [];
    tableData.push(['User ID', 'USN', 'Email', 'Display Name', 'Total Score']);

    userData.forEach((user: any) => {
      const totalScore = calculateTotalScore(user.quizData);
      tableData.push([user.uid, user.USN, user.email, user.displayName, totalScore]);
    });

    doc.autoTable({
      head: tableData[0],
      body: tableData.slice(1),
    });

    doc.save('userData.pdf');
  };

  return (
    <div className='my-[70px] p-6'>
      <h1 className='text-3xl font-bold mb-6'>Admin Page</h1>
      <button
        onClick={handleDownloadPDF}
        disabled= {true}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4`}
      >
        Download Excel
      </button>
      <table className='min-w-full bg-gray-800 rounded-lg shadow-md mt-4'>
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
          {userData.map((user : any) => (
            <tr key={user.uid} className='border-b-2'>
              <td className='p-4'>{user.uid}</td>
              <td className='p-4'>{user.USN}</td>
              <td className='p-4'>{user.email}</td>
              <td className='p-4'>{user.displayName}</td>
              <td className='p-4'>
                {user.quizData.map((quiz : any, index : any) => (
                  <div key={index} className='mb-4'>
                    <h4 className='text-xl font-semibold'>Quiz {index + 1}</h4>
                    <p>Score: {quiz.score}</p>
                    <p>Total Questions: {quiz.totalQuestions}</p>
                    <p>Time: {quiz.time}</p>
                    <p>Quiz ID: {quiz.quizId}</p>
                    <p>Quiz Name: {quiz.quizName}</p>
                    <p>Course: {quiz.course}</p>
                    <p>Course Code: {quiz.courseCode}</p>
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
