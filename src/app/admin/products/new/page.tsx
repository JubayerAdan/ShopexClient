"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useAdminCreateProduct } from "@/hooks/use-admin";
import { useRouter } from "next/navigation";

export default function ProductCreatePage() {
  const router = useRouter();
  const { mutate: createProduct, isPending: isLoading } = useAdminCreateProduct();

  const handleSubmit = (values: any) => {
    createProduct(values, {
      onSuccess: () => router.push("/admin/products"),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Product</h1>
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
} 