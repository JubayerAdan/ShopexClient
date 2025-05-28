import { useQuery, useMutation } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: () => apiService.getAdminProducts(),
  });
}

export function useAdminCreateProduct() {
  return useMutation({
    mutationFn: (data: any) => apiService.createAdminProduct(data),
  });
}

export function useAdminUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, ...data }: any) => apiService.updateAdminProduct({ id, data }),
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => apiService.getAdminProduct(id),
  });
} 