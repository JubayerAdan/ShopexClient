"use client"
import useAuth from "@/app/hooks/useAuth";
import Login from "@/components/auth/Login";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function page() {
  const {user, loading} = useAuth();
  const isUserPresent = !loading && user;
  const router = useRouter();
  useEffect(() => {
    if (isUserPresent) {
      router.push("/");
    }
  }, [isUserPresent, router]);
  if (!isUserPresent) {
    return (
      <div>
        <Login></Login>
      </div>
    );
  }
 
}

export default page;
