"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiMail, FiCamera } from "react-icons/fi";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import usePublicFetcher from "@/app/hooks/PublicFetcher";
import useAxiosPublic from "@/app/hooks/useAxiosPublic";
import { log } from "console";
import Router from "next/navigation";
import { useRouter } from "next/navigation";

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
      <h1 className="text-3xl font-extrabold text-center mb-8 text-white drop-shadow"> {title} </h1>
      {children}
    </motion.div>
  </div>
);

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  }: { register: any; handleSubmit: any; formState: any } = useForm();

  const [isProfileStep, setIsProfileStep] = useState(false);
  const [isCategoryStep, setIsCategoryStep] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const categories = ["Technology", "Art", "Music", "Sports", "Gaming"];
  const [userEmail, setUserEmail] = useState();
  const { createUser, updateUserProfile, googleMethod } = useAuth();

  const GoogleLogIN = async () => {
    googleMethod().then(async (user: any) => {
        const userData = {
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          google: true
        }
        const res = await useAxiosPublic().post("/register", userData);
        console.log(res);
    }).catch((error: any) => {
        console.log(error);
    })
  };
  const router = useRouter();
  const onRegisterSubmit = (data: any) => {
    const { name, email, password } = data;

    const reqbody = { email, password, name };
    
    createUser(email, password)
      .then(() => {
        updateUserProfile(
          name,
          "https://www.eventfulnigeria.com/wp-content/uploads/2021/04/Avatar-PNG-Free-Download.png"
        );
        return useAxiosPublic().post("/register", reqbody);
      })
      .then(() => {
        setUserEmail(email);
        setIsProfileStep(true);
      });
  };

  const onProfileSubmit = (data: any) => {
  
    setIsCategoryStep(true);
  };

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result as string;

      try {
        const formData = new FormData();
        formData.append("image", base64Image.split(",")[1]);
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=4c5b1bf19f3a34e3d550234b27af4dcc`,
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();

        if (result.success) {
          
          setProfilePicPreview(result.data.url);
          
          updateUserProfile("", result.data.url);
          const uploadtodatabase = await useAxiosPublic().put("https://shopex-server-xi.vercel.app/update-profile-pic", {email: userEmail, photoUrl: result.data.url});
          console.log(uploadtodatabase);
        } else {
          console.error("Failed to upload image:", result.error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const onCategoriesSubmit = () => {
    if (selectedCategories.length < 3) {
      setCategoryError("Please select at least 3 interests.");
      return;
    } else {
      console.log(categoryError);

      return useAxiosPublic().put("https://shopex-server-xi.vercel.app/update-favorite-categories", {
        email: userEmail,
        categories: selectedCategories,
      }).then(() => {
        router.push("/")
      })
    }
  };

  return (
    <FormContainer
      title={
        isCategoryStep
          ? "Choose Your Interests"
          : isProfileStep
          ? "Upload Profile Picture"
          : "Create an Account"
      }
    >
      {!isProfileStep && !isCategoryStep ? (
        <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-6">
          <div className="relative">
            <FiUser className="absolute top-3 left-3 text-indigo-400" />
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Name"
              className="w-full bg-white/20 text-white pl-10 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 border border-white/20 focus:bg-white/40 transition"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="relative">
            <FiMail className="absolute top-3 left-3 text-indigo-400" />
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email"
              className="w-full bg-white/20 text-white pl-10 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 border border-white/20 focus:bg-white/40 transition"
            />
            {errors.email && typeof errors.email.message === 'string' && (
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
            {errors.password && typeof errors.password.message === 'string' && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl text-white font-bold shadow transition-all"
          >
            Register
          </button>

          {/* <div className="flex items-center justify-center mt-4">
            <button
              type="button"
              onClick={GoogleLogIN}
              className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl text-white font-semibold transition-all shadow"
            >
              <FaGoogle className="mr-2 text-lg" /> Sign up with Google
            </button>
          </div> */}

          <p className="text-center text-indigo-200 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-300 underline hover:text-white">
              Login
            </Link>
          </p>
        </form>
      ) : isProfileStep && !isCategoryStep ? (
        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full border-4 border-indigo-500 flex items-center justify-center overflow-hidden shadow-lg">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiCamera className="text-indigo-300 text-4xl" />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProfilePicChange}
              />
            </div>
            <p className="text-indigo-200 text-sm">
              Click to upload or change your profile picture
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl text-white font-bold shadow transition-all"
          >
            Save Picture
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelection(category)}
                className={`py-2 px-4 rounded-xl font-semibold transition-all ${
                  selectedCategories.includes(category)
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-white/20 text-white hover:bg-indigo-500/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-red-400">{categoryError}</p>
          <button
            onClick={onCategoriesSubmit}
            className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-xl text-white font-bold shadow transition-all"
          >
            Finish Registration
          </button>
        </div>
      )}
    </FormContainer>
  );
};

export const LoginPage = () => {
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

        <div className="flex items-center justify-center mt-4">
          <button
            type="button"
            className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl text-white font-semibold transition-all shadow"
          >
            <FaGoogle className="mr-2 text-lg" /> Login with Google
          </button>
        </div>

        <p className="text-center text-indigo-200 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-300 underline hover:text-white">
            Register
          </Link>
        </p>
      </form>
    </FormContainer>
  );
};
