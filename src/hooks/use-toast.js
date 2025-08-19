import { useCallback } from "react";

export function useToast() {
  const toast = useCallback(({ title, description, variant = "default" }) => {
    // Simple toast implementation using alert for now
    // In a real app, you would use a proper toast library like sonner or react-hot-toast
    const message = description ? `${title}: ${description}` : title;
    
    if (variant === "destructive") {
      alert(`❌ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  }, []);

  return { toast };
}
