"use client";

import { ProductForm } from "@/components/admin/product-form";
import { useAdminProduct, useAdminUpdateProduct } from "@/hooks/use-admin";
import { useParams, useRouter } from "next/navigation";

export default function ProductEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: product, isLoading: isLoadingProduct } = useAdminProduct(id as string);
  const { mutate: updateProduct, isPending: isLoading } = useAdminUpdateProduct();

  const handleSubmit = (values: any) => {
    updateProduct(
      { id: id as string, ...values },
      {
        onSuccess: () => router.push("/admin/products"),
      }
    );
  };

  if (isLoadingProduct) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm 
        initialData={product} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
} 