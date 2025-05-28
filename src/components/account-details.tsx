'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";

export function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-6 text-xl font-semibold">Account Details</h2>
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="First Name"
            className="rounded-md border p-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="rounded-md border p-2"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-md border p-2"
        />
      </form>
    </div>
  );
} 