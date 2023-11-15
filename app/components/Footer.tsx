'use client';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lightTheme, darkTheme } from '../themes';
import { IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const themePreference = useMediaQuery('(prefers-color-scheme: dark)') ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={themePreference}>
      <footer className="footer fixed bottom-0 left-0 right-0 bg-base-300  p-4 z-50">
        <aside className="items-center grid-flow-col">
          <p>Made By Akash Singh © 2023 - All rights reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <IconButton
            color="default"
            href="https://github.com/Akash-Singh04"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="default"
            href="https://www.linkedin.com/in/akash-singh-a57081253/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            color="default"
            href="https://www.instagram.com/kind.of.akash/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
        </nav>
      </footer>
    </ThemeProvider>
  );
};

export default Footer;
