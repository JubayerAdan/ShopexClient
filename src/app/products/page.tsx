// app/products/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Filter, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import useAuth from '@/app/hooks/useAuth';
import Swal from 'sweetalert2';

const categories = [
  { name: "All", value: "all" },
  { name: "Laptops", value: "laptops" },
  { name: "Smartphones", value: "smartphones" },
  { name: "Headphones", value: "headphones" },
  { name: "Watches", value: "watches" },
  { name: "Shoes", value: "shoes" },
];

const sortOptions = [
  { name: "Most Relevant", value: "relevant" },
  { name: "Price: Low to High", value: "price_asc" },
  { name: "Price: High to Low", value: "price_desc" },
  { name: "Newest First", value: "newest" },
  { name: "Best Rating", value: "rating" },
  { name: "Most Popular", value: "popular" },
];

const priceRanges = [
  { name: "Under $50", value: { min: 0, max: 50 } },
  { name: "$50 - $100", value: { min: 50, max: 100 } },
  { name: "$100 - $200", value: { min: 100, max: 200 } },
  { name: "$200 - $500", value: { min: 200, max: 500 } },
  { name: "Over $500", value: { min: 500, max: 1000 } },
];

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('search');
  const categoryQuery = searchParams.get('category');
  const productId = searchParams.get('productId');
  const minPriceQuery = searchParams.get('minPrice');
  const maxPriceQuery = searchParams.get('maxPrice');
  const sortQuery = searchParams.get('sort');
  const ratingQuery = searchParams.get('rating');

  // Search Results State
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery || 'all');
  const [sortBy, setSortBy] = useState(sortQuery || 'relevant');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: minPriceQuery ? parseInt(minPriceQuery) : 0,
    max: maxPriceQuery ? parseInt(maxPriceQuery) : 1000
  });
  const [selectedRating, setSelectedRating] = useState(ratingQuery ? parseInt(ratingQuery) : 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeFilters, setActiveFilters] = useState<{[key: string]: any}>({});
  const itemsPerPage = 12;

  // Product Details State
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetch products with all filters
  const fetchProducts = async () => {
    if (productId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/products?`;
      // Always include search query if it exists
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      // Add category filter
      if (selectedCategory !== 'all') url += `category=${encodeURIComponent(selectedCategory)}&`;
      // Add price range
      if (priceRange.min > 0) url += `minPrice=${priceRange.min}&`;
      if (priceRange.max < 1000) url += `maxPrice=${priceRange.max}&`;
      // Add pagination and sorting
      url += `page=${currentPage}&limit=${itemsPerPage}&sort=${sortBy}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.totalProducts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update URL with current filters
  const updateUrlWithFilters = () => {
    if (productId) return;

    const params = new URLSearchParams();
    // Always maintain search query
    if (searchQuery) params.set('search', searchQuery);
    // Add other filters
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'relevant') params.set('sort', sortBy);
    if (priceRange.min > 0) params.set('minPrice', priceRange.min.toString());
    if (priceRange.max < 1000) params.set('maxPrice', priceRange.max.toString());
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = `/products?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  // Update active filters display
  useEffect(() => {
    const filters: {[key: string]: any} = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (priceRange.min > 0 || priceRange.max < 1000) filters.price = `${priceRange.min} - ${priceRange.max}`;
    if (selectedRating > 0) filters.rating = `${selectedRating}+ stars`;
    if (sortBy !== 'relevant') filters.sort = sortOptions.find(opt => opt.value === sortBy)?.name;
    setActiveFilters(filters);
  }, [searchQuery, selectedCategory, priceRange, selectedRating, sortBy]);

  // Fetch product details
  const fetchProductDetails = async () => {
    const productId = searchParams.get('productId');
    if (!productId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/products/${productId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Product not found.");
        }
        throw new Error(`Failed to fetch product details (status: ${res.status})`);
      }
      const data = await res.json();
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0].id);
      }

      // Track product view if user is logged in
      if (user?.email) {
        try {
          await fetch('http://localhost:5000/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              productId: productId
            })
          });
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      }

      // Fetch related products
      if (data && data.category) {
        const relatedRes = await fetch(`http://localhost:5000/products?category=${encodeURIComponent(data.category)}&limit=5`);
        if (relatedRes.ok) {
          let relatedData = await relatedRes.json();
          relatedData = relatedData.products.filter((p: any) => p._id !== data._id).slice(0, 4);
          setRelatedProducts(relatedData);
        }
      }
    } catch (err: any) {
      console.error("Error fetching product details:", err);
      setError(err.message);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  useEffect(() => {
    if (!productId) {
      updateUrlWithFilters();
      fetchProducts();
    }
  }, [selectedCategory, sortBy, priceRange, currentPage]);

  const handleAddToCart = async (product: any, quantity: number = 1) => {
    if (!user) {
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
      const productToAdd = {
        ...product,
        selectedVariant: selectedVariant,
        quantity: quantity
      };
      await addToCart(productToAdd, quantity);

      // Track purchase if user is logged in
      if (user?.email) {
        try {
          await fetch('http://localhost:5000/track-purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              productId: product._id
            })
          });
        } catch (error) {
          console.error('Error tracking purchase:', error);
        }
      }

      Swal.fire({
        title: 'Added to Cart!',
        text: `${product.name} (x${quantity}) added to cart!`,
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

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'category':
        setSelectedCategory('all');
        break;
      case 'price':
        setPriceRange({ min: 0, max: 1000 });
        break;
      case 'rating':
        setSelectedRating(0);
        break;
      case 'sort':
        setSortBy('relevant');
        break;
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('relevant');
    setPriceRange({ min: 0, max: 1000 });
    setCurrentPage(1);
    // Don't clear search query
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  useEffect(() => {
    if (productId && product) {
      document.title = `${product.name} - Shopex`;
    } else if (searchQuery) {
      document.title = `Search Results for "${searchQuery}" - Shopex`;
    } else if (selectedCategory && selectedCategory !== 'all') {
      document.title = `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} - Shopex`;
    } else {
      document.title = "All Products - Shopex";
    }
  }, [productId, product, searchQuery, selectedCategory]);

  // Update the useEffect for fetching products
  useEffect(() => {
    if (!productId) {
      const fetchData = async () => {
        await fetchProducts();
      };
      fetchData();
    }
  }, [selectedCategory, sortBy, priceRange, currentPage, searchQuery]); // Add searchTerm to dependencies

  // Add this function to handle search
  const handleSearch = (query: string) => {
    setCurrentPage(1); // Reset to first page on new search
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', query);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Add this useEffect to handle URL changes
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      fetchProductDetails();
    } else {
      setProduct(null); // Clear product when not viewing details
    }
  }, [searchParams]); // Watch for URL parameter changes

  // Update the product card click handler
  const handleProductClick = (productId: string) => {
    setIsLoading(true);
    setProduct(null); // Clear current product
    router.push(`/products?productId=${productId}`, { scroll: false });
  };

  // Add a back button to return to search results
  const handleBackToSearch = () => {
    setIsLoading(true);
    setProduct(null);
    router.push('/products', { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div role="alert" className="alert alert-error bg-red-100 border-red-400 text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error! {error}</span>
        </div>
      </div>
    );
  }

  // Render Product Details
  if (productId && product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBackToSearch}
          className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Search Results
        </button>
        {/* Product Details Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 md:p-8 lg:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative flex justify-center items-center bg-indigo-50 rounded-xl p-4 aspect-square">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-contain max-h-[500px] w-auto rounded-lg"
                />
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    >
                      <ChevronLeft className="h-6 w-6 text-indigo-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    >
                      <ChevronRight className="h-6 w-6 text-indigo-700" />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-indigo-600 shadow-md'
                          : 'border-transparent hover:border-indigo-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <span className="text-sm font-medium text-indigo-500 uppercase tracking-wider mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-800 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-semibold text-yellow-600 mb-6">
                ${product.price}
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description || "No description available for this product."}
              </p>

              {/* Variant Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Select Variant
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedVariant === variant.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-indigo-200 hover:border-indigo-300 text-indigo-600'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-indigo-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center w-max border border-indigo-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-indigo-700 hover:bg-indigo-50 rounded-l-lg focus:outline-none"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1) setQuantity(val);
                      else if (e.target.value === "") setQuantity(1);
                    }}
                    min="1"
                    className="w-16 bg-white text-center py-2 border-t border-b border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-indigo-700 hover:bg-indigo-50 rounded-r-lg focus:outline-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product, quantity)}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-indigo-800 font-semibold px-6 py-3 rounded-lg shadow transition-colors"
                disabled={!user}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              {!user && <p className="text-sm text-red-500 mt-2">Please log in to add items to your cart.</p>}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="group bg-white border border-indigo-100 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                  <Link 
                    href={`/products?productId=${relatedProduct._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(relatedProduct._id);
                    }}
                    className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl"
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col p-4">
                    <Link 
                      href={`/products?productId=${relatedProduct._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleProductClick(relatedProduct._id);
                      }}
                      className="hover:text-indigo-600"
                    >
                      <h3 className="text-lg font-bold text-indigo-800 mb-1 truncate">{relatedProduct.name}</h3>
                    </Link>
                    <p className="text-gray-500 mb-2 flex-1">${relatedProduct.price}</p>
                    <button
                      onClick={() => handleAddToCart(relatedProduct)}
                      className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-indigo-800 font-semibold px-4 py-2 rounded-lg shadow transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Search Results
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Results Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {totalProducts} products found
          {categoryQuery && ` in ${categoryQuery}`}
        </p>

        {/* Active Filters */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
              >
                <span className="text-sm font-medium">{key}: {value}</span>
                <button
                  onClick={() => removeFilter(key)}
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-800">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium text-indigo-700 mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryChange(category.value)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium text-indigo-700 mb-2">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.name}
                    onClick={() => handlePriceRangeChange(range.value.min, range.value.max)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      priceRange.min === range.value.min && priceRange.max === range.value.max
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    {range.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="font-medium text-indigo-700 mb-2">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedRating === rating
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-indigo-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="group bg-white border border-indigo-100 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                <Link 
                  href={`/products?productId=${product._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleProductClick(product._id);
                  }}
                  className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 flex flex-col p-4">
                  <Link 
                    href={`/products?productId=${product._id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleProductClick(product._id);
                    }}
                    className="hover:text-indigo-600"
                  >
                    <h3 className="text-lg font-bold text-indigo-800 mb-1 truncate">{product.name}</h3>
                  </Link>
                  <p className="text-gray-500 mb-2 flex-1">${product.price}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-indigo-800 font-semibold px-4 py-2 rounded-lg shadow transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 disabled:opacity-50 transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-semibold text-indigo-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;