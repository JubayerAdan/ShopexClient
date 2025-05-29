"use client";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import app from "./firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const AuthProvider = ({ children }) => {
  const googleAuthProvider = new GoogleAuthProvider();
  const githubAuthProvider = new GithubAuthProvider();
  const facebookAuthProvider = new FacebookAuthProvider();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const googleMethod = () => {
    setLoading(true);
    
    return signInWithPopup(auth, googleAuthProvider);
  };
  
  const githubMethod = () => {
    setLoading(true);
    return signInWithPopup(auth, githubAuthProvider);
  };
  const facebookMethod = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookAuthProvider);
  };
  const updateUserProfile = (name, photo) => {
    setLoading(true);
    if (name.length == 0 || name == undefined || name == null) {
      return updateProfile(auth.currentUser, {
        photoURL: photo,
      });
    }
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };
  const SendVerificationEmail = async () => {
    return sendEmailVerification(auth.currentUser).then(() => {});
  };

  const currentUserFromBackend = async () => {
    try {
      // Only attempt to fetch if not loading and user exists with email
      if (!loading && user && user.email) {
        const response = await fetch(`https://shopex-server-xi.vercel.app/users/${user.email}`);
        
        // Check if the response is ok before parsing JSON
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const logOut = () => {
    return signOut(auth);
  };
  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    googleMethod,
    githubMethod,
    facebookMethod,
    updateUserProfile,
    SendVerificationEmail,
    currentUserFromBackend,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
