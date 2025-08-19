"use client";

import { useEffect } from 'react';

export function GlobalErrorHandler({ children }) {
  useEffect(() => {
    // Global error handler for ResizeObserver errors
    const handleError = (event) => {
      if (
        event.error?.message?.includes('ResizeObserver loop completed with undelivered notifications') ||
        event.error?.message?.includes('ResizeObserver loop limit exceeded')
      ) {
        // Suppress ResizeObserver errors as they are usually harmless
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event) => {
      if (
        event.reason?.message?.includes('ResizeObserver loop completed with undelivered notifications') ||
        event.reason?.message?.includes('ResizeObserver loop limit exceeded')
      ) {
        // Suppress ResizeObserver promise rejections
        event.preventDefault();
        return false;
      }
    };

    // Add global error listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return children;
}
