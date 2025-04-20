'use client';

import {Button} from '@/components/ui/button';
import {Github, Instagram, Linkedin, Twitter} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-gradient-to-b from-black to-red-900 text-white flex items-center justify-center gap-4 rounded-md mt-4 p-4">
      <Button variant="ghost" className="text-white" asChild>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" className="text-white" asChild>
        <a
          href="https://www.linkedin.com/in/avinash-verma-20946b21b/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" className="text-white" asChild>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="h-5 w-5" />
        </a>
      </Button>
      <Button variant="ghost" className="text-white" asChild>
        <a
          href="https://www.instagram.com/avinash_vermaa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-5 w-5" />
        </a>
      </Button>
    </footer>
  );
};

export default Footer;
