// Utility to suppress ResizeObserver loop errors
// This is a common issue with UI libraries that use ResizeObserver

export const suppressResizeObserverLoopError = () => {
  const errorHandler = (e) => {
    if (
      e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
      e.message.includes('ResizeObserver loop limit exceeded')
    ) {
      // Suppress this specific error as it's usually harmless
      e.stopImmediatePropagation();
      return;
    }
  };

  // Add error listener
  window.addEventListener('error', errorHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('error', errorHandler);
  };
};

// Hook to use the error suppression
export const useResizeObserverFix = () => {
  if (typeof window !== 'undefined') {
    const cleanup = suppressResizeObserverLoopError();
    
    // Cleanup on unmount
    return cleanup;
  }
  return () => {};
};
