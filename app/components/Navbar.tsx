'use client'
import React from 'react';
import auth from '../firebase';
import { signOut } from "firebase/auth";
import { useRouter } from 'next/navigation';
const Navbar = () => {
  const user = auth.currentUser; // Get the currently signed-in user
  const router = useRouter();
  console.log(user);
  const handlesignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Sign out successful");
      router.push(`/`);

    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }
  return (
    <div className="navbar bg-base-300 fixed top-0 w-full z-50 text-white">
      <div className="navbar-start">
        <a href="/" className="text-lg font-bold p-2">QUIZ</a> {/* Add your logo here */}
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/">Home</a></li>
          {user ? ( // Check if the user is logged in
            <li>
              <button onClick={handlesignOut}>Sign Out</button>
            </li>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
