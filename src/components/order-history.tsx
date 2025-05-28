"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, PackageCheck, Truck } from "lucide-react";

const orders = [
  {
    id: "#3210",
    date: "Mar 15, 2024",
    status: "Delivered",
    items: 3,
    total: 245.0,
  },
  {
    id: "#3209",
    date: "Feb 28, 2024",
    status: "Shipped",
    items: 2,
    total: 155.99,
  },
];

export function OrderHistory() {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-xl font-semibold">Order History</h2>
      <div className="space-y-4">
        <p className="text-gray-500">No orders yet</p>
      </div>
    </div>
  );
} 