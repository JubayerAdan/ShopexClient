"use client";

import { useForm } from "react-hook-form";
import { Product } from "@/data/products";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { FormImageUpload } from "@/components/form-image-upload";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (values: Product) => void;
  isLoading: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  const form = useForm<Product>({
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      images: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            control={form.control}
            name="name"
            label="Product Name"
            placeholder="Enter product name"
          />
          
          <FormInput
            control={form.control}
            name="price"
            label="Price"
            type="number"
            placeholder="0.00"
          />
          
          <FormInput
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select category"
          />
          
          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Product description"
          />
          
          <FormImageUpload
            control={form.control}
            name="images"
            label="Product Images"
          />
        </div>
        
        <Button type="submit" disabled={isLoading}>
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
} 