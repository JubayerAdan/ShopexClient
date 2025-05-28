"use client";

import { useEffect } from 'react';
import Hero from "@/components/home/carousel";
import Category from "@/components/home/categories";

export default function Home() {
  useEffect(() => {
    document.title = "Shopex - Your One-Stop Shopping Destination";
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hero></Hero>
      <Category></Category>
    </main>
  );
}
