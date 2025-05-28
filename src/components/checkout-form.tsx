"use client";

import { Button } from "@/components/ui/button";

export function CheckoutForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
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
        <input
          type="text"
          placeholder="Address"
          className="w-full rounded-md border p-2"
        />
      </div>
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Place Order
      </Button>
    </form>
  );
} 