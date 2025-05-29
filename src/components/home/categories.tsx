"use client";

import useAuth from "@/app/hooks/useAuth";
import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Swal from 'sweetalert2';

const Category = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;
  const { user, loading } = useAuth();

  // Fetch products when page changes
  const fetchProducts = useCallback(async () => {
    if (loading) return;
    
    setIsLoading(true);
    try {
      let url = `https://shopex-server-xi.vercel.app/products?page=${currentPage}&limit=${itemsPerPage}`;
      
      if (user?.email) {
        url = `https://shopex-server-xi.vercel.app/feed/personalized?email=${user.email}&page=${currentPage}&limit=${itemsPerPage}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, user?.email, loading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add to Cart handler
  const { addToCart } = useCart();
  const handleAddToCart = async (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      const result = await Swal.fire({
        title: 'Login Required',
        text: 'Would you like to login to add items to your cart?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Continue as Guest',
        confirmButtonColor: '#4F46E5',
        cancelButtonColor: '#6B7280',
      });

      if (result.isConfirmed) {
        window.location.href = '/login';
      }
      return;
    }

    try {
      await addToCart(product);
      Swal.fire({
        title: 'Added to Cart!',
        text: `${product.name} has been added to your cart`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      Swal.fire({
        title: 'Error',
        text: error?.message || "Failed to add item to cart",
        icon: 'error',
        confirmButtonColor: '#4F46E5',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto my-10 px-2 sm:px-4 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-2 sm:px-4">
      {/* Product Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(products) && products.map((product: any) => (
          <div 
            key={product._id}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <Link href={`/products/?productId=${product._id}`}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </Link>
            
            <div className="p-4">
              <Link href={`/products/?productId=${product._id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3.5rem]">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={(e) => handleAddToCart(product, e)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        <button
          disabled={currentPage === 1 || isLoading}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="px-4 py-2 font-semibold text-indigo-700">
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || isLoading}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Category;
