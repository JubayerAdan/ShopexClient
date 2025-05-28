"use client";
import React, { useState, useEffect } from "react";
import Welcome from "./welcome";
import { ClipLoader } from "react-spinners"; // Importing the loader from react-spinners
import Carousel from "./carousel";
import Navbar from "./Navbar";
import Categories from "./categories";
import useAuth from "@/app/hooks/useAuth";
interface HomeProps {
  navprops?: object;
}
const Home: React.FC = () => {
  const [isContinuingWithoutAccount, setIsContinuingWithoutAccount] = useState<
    boolean | null
  >(null);
 
  const {user, loading} = useAuth();
  const userObj = !loading ? user : null;
   
  useEffect(() => {
    const isUserContinuing =
      localStorage.getItem("isContinuingWithoutAccount") === "true";
    setIsContinuingWithoutAccount(isUserContinuing);
  }, []);

  const handleContinueWithoutAccount = () => {
    // Set the flag in localStorage and update the state to trigger re-render
    localStorage.setItem("isContinuingWithoutAccount", "true");
    setIsContinuingWithoutAccount(true); // Update state to show home content
  };

  // Render nothing or a loading state until we know the value from localStorage
  if (isContinuingWithoutAccount === null) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <ClipLoader color="#00BFFF" size={50} />
      </div>
    ); // Show loader while checking localStorage
  }

  return (
    <div>
      {/* Conditionally render Welcome or Home content */}
      {isContinuingWithoutAccount ? (
        <div>
          <Navbar></Navbar>
          <Carousel></Carousel>
          <Categories></Categories>
        </div>
      ) : (
        <Welcome onContinueWithoutAccount={handleContinueWithoutAccount} />
      )}
    </div>
  );
};

export default Home;
