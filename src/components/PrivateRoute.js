import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom'; // For redirecting users
import { onAuthStateChanged } from 'firebase/auth'; // Firebase method
import { auth } from './firebase'; // Your Firebase config

function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Stop loading after auth state is checked
        });

        return () => unsubscribe(); // Clean up the listener when the component unmounts
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading spinner or message
    }

    // If no user is authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // If user is authenticated, render the protected route
    return children;
}

export default PrivateRoute;
