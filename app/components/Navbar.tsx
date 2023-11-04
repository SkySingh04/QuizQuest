'use client'
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lightTheme, darkTheme } from '../themes';

const Navbar = () => {
  const themePreference = useMediaQuery('(prefers-color-scheme: dark)') ? darkTheme : lightTheme;
  const [user, setUser] = useState(null); // Use state to track the user's authentication state
  const router = useRouter();

  // Add a useEffect to listen for changes in the user's authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user:any) => {
      setUser(user); // Update the user state when the authentication state changes
    });

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handlesignOut = () => {
    // Sign out the user
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Sign out successful");
      router.push(`/`);

    }).catch((error) => {
      // An error happened.
      console.log(error);
    });

    // After successful sign-out, you can also clear the user state if needed
    setUser(null);

    router.push(`/`);
  };

  return (
    <ThemeProvider theme={themePreference}>
    <div className="navbar bg-base-300 fixed top-0 w-full z-50">
      <div className="navbar-start">
        <a href="/" className="text-lg font-bold p-2">
          QUIZ {/* Add your logo here */}
        </a>
      </div>
      <div className="navbar-end text-center">
        <ul className="menu menu-horizontal px-0 ">
          <li><a href="/">Home</a></li>
          {user ? ( // Check if the user is logged in
            <>
              <li>
                <button onClick={handlesignOut}>Sign Out</button>
              </li>
              <li><a href="/quiz">Quiz</a></li>
            </>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </>
          )}
        </ul>
      </div>
    </div>
    </ThemeProvider>
  );
}

export default Navbar;
