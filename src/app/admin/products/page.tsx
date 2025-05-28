"use client";

import { Button } from "@/components/ui/button";

import { ProductColumns } from "./columns";
import { useAdminProducts } from "@/hooks/use-admin";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button asChild>
          <Link href="/admin/products/new" className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      
      
    </div>
  );
} 