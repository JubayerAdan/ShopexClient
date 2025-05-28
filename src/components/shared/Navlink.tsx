"use client"
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

interface NavlinkProps {
  href: string;
}

const Navlink: React.FC<NavlinkProps> = ({ href }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href; 

  return (
    <Link href={href} className={`flex items-center space-x-2 px-4 py-2 rounded transition duration-300 ${
        isActive
          ? "text-blue-600 bg-blue-100 font-semibold" 
          : "text-gray-700 hover:text-blue-600 hover:bg-blue-100"
      }`}>
      
   
    </Link>
  );
};

export default Navlink;
