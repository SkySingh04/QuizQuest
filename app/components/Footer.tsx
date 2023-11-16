'use client';
import React from 'react';
import { IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {

  return (
      <footer className="footer fixed bottom-0 left-0 right-0  px-2 z-50 flex justify-center  bg-slate-800 text-white ">
        <aside className="items-center grid-flow-col">
          <p>Made By Akash Singh © 2023 - All rights reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <IconButton
            className='text-white'
            color="inherit"
            href="https://github.com/Akash-Singh04"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            className='text-white'
            color="inherit"
            href="https://www.linkedin.com/in/akash-singh-a57081253/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            className='text-white'
            color="inherit"
            href="https://www.instagram.com/kind.of.akash/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
        </nav>
      </footer>
  );
};

export default Footer;
