import React, { useContext } from "react";
import { AuthContext } from "../../firebase/AuthProvider";

const useAuth = () => {
  const Auth: {
    user: any;
    loading: any;
    createUser: any;
    signIn: any;
    logOut: any;
    googleMethod: any;
    githubMethod: any;
    facebookMethod: any;
    updateUserProfile: any;
    SendVerificationEmail: any;
    currentUserFromBackend: any;
  } = useContext<any>(AuthContext);
  return Auth;
};

export default useAuth;
