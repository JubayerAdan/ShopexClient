"use client"
import useAuth from "@/app/hooks/useAuth";
import { RegisterPage } from "@/components/auth/Register";
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
  return (
    <div>
      <RegisterPage></RegisterPage>
    </div>
  );
}

export default page;
