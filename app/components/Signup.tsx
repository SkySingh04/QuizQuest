import React from "react";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { doc , setDoc} from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email = data.get('email') as string;
    let password = data.get('password') as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // const user_id = uuidv4();      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: data.get('firstName') + ' ' + data.get('lastName'),
        USN: data.get('USN'),
        quizData: []
      }
      // Create a user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
          setDoc(userDocRef, userData)
      .then(() => {
        console.log('User document created with UID: ', user.uid);
      })
      .catch((error) => {
        console.error('Error creating user document: ', error);
      });

      // You can also update the user's profile
      await updateProfile(user, {
        displayName: data.get('firstName') + ' ' + data.get('lastName'),
      });

      router.push(`/`);
    } catch (error : any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setError(errorMessage); // Set the error message
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit} className="loginform bg-customBlue">
        <h1>Create Account</h1>
        
        <div className="flex space-x-2">
          <input
            className="bg-customBeige text-black flex-1"
            type="text"
            name="firstName"
            placeholder="First Name"
          />
          <input
            className="bg-customBeige text-black flex-1"
            type="text"
            name="lastName"
            placeholder="Last Name"
          />
        </div>
        <input
        className="bg-customBeige text-black"
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
        className="bg-customBeige text-black"
          type="text"
          name="USN"
          placeholder="USN"
        />
        <input
        className="bg-customBeige text-black"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button className="loginbutton bg-customViolet">Sign Up</button>
        {error && (
            <p className="text-red-700 border border-black">
              {error}
            </p>
          )}
      </form>
    </div>
  );
}

export default SignUpForm;
