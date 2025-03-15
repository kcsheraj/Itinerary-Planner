import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // Start as undefined to distinguish from null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>; // Prevent redirect before authentication check is complete
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
