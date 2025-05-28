"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";

const FormContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900/80 via-indigo-800/80 to-blue-900/80 backdrop-blur-lg">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-white/10 shadow-2xl rounded-2xl p-8 max-w-md w-full border border-white/20 backdrop-blur-lg"
    >
      <h1 className="text-3xl font-extrabold text-center mb-8 text-white drop-shadow">
        {title}
      </h1>
      {children}
    </motion.div>
  </div>
);

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { signIn } = useAuth();

  const onSubmit = (data: any) => {
    const { email, password } = data;
    signIn(email, password).then(() => {
      router.push("/");
    });
  };

  return (
    <FormContainer title="Welcome Back">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <FiMail className="absolute top-3 left-3 text-indigo-400" />
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Email"
            className="w-full bg-white/20 text-white pl-10 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 border border-white/20 focus:bg-white/40 transition"
          />
          {errors.email && typeof errors.email.message === "string" && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="relative">
          <FiLock className="absolute top-3 left-3 text-indigo-400" />
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Password"
            className="w-full bg-white/20 text-white pl-10 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 border border-white/20 focus:bg-white/40 transition"
          />
          {errors.password && typeof errors.password.message === "string" && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl text-white font-bold shadow transition-all"
        >
          Login
        </button>

        {/* <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl text-white font-semibold transition-all shadow"
          >
            <FaGoogle className="mr-2 text-lg" /> Login with Google
          </button>
        </div> */}

        <p className="text-center text-indigo-200 mt-4">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-300 underline hover:text-white"
          >
            Register
          </Link>
        </p>
      </form>
    </FormContainer>
  );
};

export default LoginPage;