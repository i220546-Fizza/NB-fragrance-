import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta';

export default function NotFound() {
  usePageMeta('Page Not Found', 'The page you are looking for could not be found.');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-offwhite text-center px-6">
      <span className="font-display text-7xl gold-text-gradient">404</span>
      <h1 className="font-display text-2xl text-cocoa mt-4">This page has drifted away</h1>
      <p className="text-cocoa/60 mt-3 max-w-sm">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Return Home
      </Link>
    </div>
  );
}
