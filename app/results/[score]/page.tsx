'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import auth from '../../firebase';

export default function Page() {
  const params = useParams();
  const score = params.score;
  const user = auth.currentUser;

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      getAndDisplayUserData(user.email);
    }
  }, [user]);

  const getAndDisplayUserData = async (user:any) => {
    // Fetch user data from Firestore based on the user's ID
    try {
        const fName = user?.displayName;
        console.log(fName);
      } 
     catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1>Results</h1>
      {/* <p>
        User: {fName} {lastName}
      </p>
      <p>
        Score: {score}/{totalNumberOfQuestions}
      </p> */}
    </div>
  );
}
