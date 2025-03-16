import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import useUserStore from "../store/useUserStore"; // Import the Zustand store

const ProtectedRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.uid !== user?.uid) {
        setUser(currentUser); // Only update Zustand store if user actually changes
      }
      setIsLoading(false); // Stop loading
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [setUser]); // ✅ No `user` dependency to avoid infinite loops

  if (isLoading) {
    return <div>Loading...</div>; // Display loading until user state is determined
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
