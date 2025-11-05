/**
 * Authentication Context - Global auth state management
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase token and send to backend
          const token = await firebaseUser.getIdToken();
          
          // Send token to backend for login/sync
          const response = await api.post('/auth/login', {
            firebase_token: token
          });
          
          // Set user data from backend response
          if (response.data.success) {
            setUser({
              ...firebaseUser,
              ...response.data.data.user
            });
          }
        } catch (error) {
          console.error('Error syncing with backend:', error);
          setUser(firebaseUser); // Fallback to Firebase user
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, role, name) => {
    try {
      setError(null);
      
      // First, register user in backend
      await api.post('/auth/register', {
        email,
        name,
        role
      });
      
      // Then create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Get token and login to backend
      const token = await userCredential.user.getIdToken();
      const response = await api.post('/auth/login', {
        firebase_token: token
      });
      
      if (response.data.success) {
        setUser({
          ...userCredential.user,
          ...response.data.data.user
        });
      }
      
      return userCredential.user;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw new Error(err.response?.data?.detail || err.message);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get token and send to backend
      const token = await userCredential.user.getIdToken();
      const response = await api.post('/auth/login', {
        firebase_token: token
      });
      
      if (response.data.success) {
        setUser({
          ...userCredential.user,
          ...response.data.data.user
        });
      }
      
      return userCredential.user;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw new Error(err.response?.data?.detail || err.message);
    }
  };

  const logout = async () => {
    try {
      // Logout from backend (optional)
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.error('Backend logout error:', error);
      }
      
      // Logout from Firebase
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get token and send to backend (backend will create user if not exists)
      const token = await userCredential.user.getIdToken();
      const response = await api.post('/auth/login', {
        firebase_token: token
      });
      
      if (response.data.success) {
        setUser({
          ...userCredential.user,
          ...response.data.data.user
        });
      }
      
      return userCredential.user;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw new Error(err.response?.data?.detail || err.message);
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    loginWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
