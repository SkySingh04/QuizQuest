'use client'
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection  ,  doc , setDoc} from 'firebase/firestore'; // Import Firestore functions
import { auth, db } from '../firebase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lightTheme, darkTheme } from '../themes';
import { v4 as uuidv4 } from 'uuid';
export default function SignUp() {
  const themePreference = useMediaQuery('(prefers-color-scheme: dark)') ? darkTheme : lightTheme;
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


      // const userDocRef = await addDoc(collection(db, 'users'), {
      //   uid: user.uid,
      //   email: user.email,
      //   displayName: data.get('firstName') + ' ' + data.get('lastName'),
      //   USN: data.get('USN'),
      //   quizData: []
      // }).then((docRef) => {
      //   console.log('Document written with ID: ', docRef.id);
      // }
      // ).catch((error) => {
      //   console.error('Error adding document: ', error);
      // });

      // You can also update the user's profile
      await updateProfile(user, {
        displayName: data.get('firstName') + ' ' + data.get('lastName'),
      });

      router.push(`/`);
    } catch (error : any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage); // Set the error message
    }
  };


  return (
    <ThemeProvider theme={themePreference}>
      <CssBaseline />
      <Container component="main" maxWidth="xs"className="min-h-screen flex flex-col items-center justify-center">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh', // Set the minimum height to take the entire window
            justifyContent: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="USN"
                  label="USN"
                  name="USN"
                  autoComplete="USN"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
