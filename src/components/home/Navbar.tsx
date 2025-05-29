"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logOut } = useAuth();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]); // Store all products

  // Fetch all products when component mounts
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch('https://shopex-server-xi.vercel.app/products?page=1&limit=100');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]); // Set empty array on error
      }
    };
    fetchAllProducts();
  }, []);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length > 2) {
      // Filter products client-side
      const filteredProducts = allProducts.filter((product: any) => {
        const searchRegex = new RegExp(query, 'i');
        return searchRegex.test(product.name) || searchRegex.test(product.category);
      }).slice(0, 10); // Limit to 10 suggestions

      setSuggestions(filteredProducts);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    const searchQuery = suggestion.name;
    const searchUrl = suggestion.category 
      ? `/products?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(suggestion.category)}`
      : `/products?search=${encodeURIComponent(searchQuery)}`;

    setSearchTerm(searchQuery);
    setSuggestions([]);
    setShowSuggestions(false);
    router.push(searchUrl);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <nav className="navbar sticky top-0 z-50 bg-indigo-600 shadow-lg transition-all">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex-shrink-0 mr-6">
          <Link href="/" className="btn btn-ghost text-xl md:text-2xl font-extrabold tracking-tight text-white">
            <span className="text-yellow-300">Shop</span>ex
          </Link>
        </div>

        {/* Center: Search Bar (Desktop only) */}
        <div className="hidden md:flex flex-grow justify-center px-4 min-w-[200px] max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center px-3 py-1 border border-white/30 rounded-lg bg-white/20 focus-within:bg-white/80 focus-within:shadow-md transition-all duration-200 w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm px-2 text-white placeholder-white focus:text-gray-800 focus:placeholder-gray-400 transition-all w-full"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={() => searchTerm.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100) }
              />
              <button type="submit" className="p-1">
                <Search className="h-4 w-4 text-white focus:text-gray-800" />
              </button>
            </div>
          </form>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md border border-indigo-100 z-10 overflow-hidden">
              {suggestions.map((suggestion: any, index: number) => (
                <li
                  key={index}
                  className="px-4 py-2 text-indigo-800 hover:bg-indigo-50 cursor-pointer"
                  onMouseDown={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Nav Links, Cart, Notification, Profile */}
        <div className="hidden md:flex items-center space-x-4 ml-6 flex-shrink-0">
          <Link href="/" className="font-semibold text-white hover:text-yellow-300 transition-colors duration-200">
            Home
          </Link>
          <Link href="#" className="font-semibold text-white hover:text-yellow-300 transition-colors duration-200">
            Contact
          </Link>
          <Link href="#" className="font-semibold text-white hover:text-yellow-300 transition-colors duration-200">
            About
          </Link>

          {!loading && (
            !user ? (
              <Link href="/register" className="px-4 py-2 bg-yellow-300 text-indigo-700 font-bold rounded-md hover:bg-yellow-400 transition-colors shadow">
                Register
              </Link>
            ) : (
              <>
                {/* Cart Dropdown */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <ShoppingCart className="h-6 w-6 text-white" />
                      {cart.length > 0 && (
                        <span className="badge badge-sm indicator-item bg-yellow-400 border-none text-indigo-700 font-bold">
                          {cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content menu bg-indigo-50 rounded-box w-full md:w-80 p-4 shadow-xl mt-4 border border-indigo-100 max-w-[95vw] z-50 relative"
                  >
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-indigo-100 mb-4">
                      <h3 className="text-base md:text-lg font-bold text-indigo-900">Cart ({cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)} item{cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) !== 1 ? 's' : ''})</h3>
                      
                    </div>

                    {/* Cart Items List */}
                    <div className="max-h-60 overflow-y-auto styled-scrollbar pr-2">
                      {cart.length === 0 ? (
                        <p className="text-center text-indigo-400 text-sm md:text-base">Your cart is empty.</p>
                      ) : (
                        cart.map((item: any) => (
                          <div key={item._id} className="flex items-start gap-2 md:gap-3 py-3 border-b border-indigo-50 last:border-b-0">
                            <img src={item.image} alt={item.name} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md border border-indigo-100 flex-shrink-0" />
                            <div className="flex-1 min-w-0 flex flex-col">
                              <h4
                                className="text-sm md:text-base font-medium text-indigo-900 break-words line-clamp-2 leading-snug"
                                style={{ wordBreak: "break-word" }}
                                title={item.name}
                              >
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1 md:gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                  <button
                                    className="px-1.5 md:px-2 py-0.5 border border-indigo-200 rounded text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 text-sm md:text-base"
                                    onClick={() => updateQuantity(item._id, Math.max(1, (item.quantity || 1) - 1))}
                                    disabled={(item.quantity || 1) <= 1}
                                  >-</button>
                                  <span className="text-sm md:text-base font-semibold text-indigo-700">{item.quantity || 1}</span>
                                  <button
                                    className="px-1.5 md:px-2 py-0.5 border border-indigo-200 rounded text-indigo-600 hover:bg-indigo-100 text-sm md:text-base"
                                    onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                  >+</button>
                                </div>
                                <button
                                  className="ml-2 text-indigo-400 hover:text-red-500 transition-colors"
                                  onClick={() => removeFromCart(item._id)}
                                  title="Delete"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <span className="text-sm md:text-base font-bold text-indigo-900 flex-shrink-0 ml-2">${item.price.toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Continue Shopping Button */}
                    {cart.length > 0 && (
                      <div className="mt-4 text-center">
                         <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm md:text-base">Continue shopping</Link>
                      </div>
                    )}

                    {/* Dropdown Footer */}
                    {cart.length > 0 && (
                    <div className="pt-4 border-t border-indigo-100 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm md:text-base font-bold text-indigo-800">Subtotal</span>
                        <span className="text-base md:text-lg font-bold text-indigo-900">${cart.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2)}</span>
                      </div>
                      <p className="text-xs md:text-sm text-indigo-400 mb-4">Taxes and promotions calculated at checkout</p>
                      <button className="w-full py-2 md:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm md:text-base">
                        Proceed to checkout
                      </button>
                    </div>
                    )}
                  </div>
                </div>

                {/* Notification Dropdown */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content bg-white z-20 mt-3 w-80 shadow-xl rounded-xl border border-indigo-100"
                  >
                    <div className="p-4">
                      <div className="font-bold text-indigo-700 mb-2">Notifications</div>
                      <ul className="space-y-2">
                        <li className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                          <span className="font-semibold text-indigo-700">Order #1234</span> has shipped!
                          <span className="ml-2 text-xs text-yellow-500">2m ago</span>
                        </li>
                        <li className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                          <span className="font-semibold text-indigo-700">New message</span> from support.
                          <span className="ml-2 text-xs text-yellow-500">10m ago</span>
                        </li>
                        <li className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                          <span className="font-semibold text-indigo-700">Sale</span> starts now!
                          <span className="ml-2 text-xs text-yellow-500">1h ago</span>
                        </li>
                      </ul>
                      <div className="divider my-2" />
                      <button className="btn btn-sm btn-block bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg mt-2">
                        View all
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Dropdown */}
                <div className="dropdown dropdown-end hidden md:block">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full ring ring-yellow-300 ring-offset-base-100 ring-offset-2">
                      <img
                        alt="Profile"
                        src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                      />
                    </div>
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content bg-white rounded-xl z-20 mt-3 w-64 p-4 shadow-xl border border-indigo-100 flex flex-col items-center"
                  >
                    {/* Horizontal profile card wrapped in a Link */}
                    <Link href="" className="flex items-center gap-4 w-full mb-4 p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-900 transition-colors">
                      <img
                        src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                        alt="Profile"
                        className="w-14 h-14 rounded-full border-2 border-yellow-300"
                      />
                      <span className="text-lg font-bold text-indigo-800 truncate">{user?.displayName || user?.name || 'User'}</span>
                    </Link>
                    <button onClick={logOut} className="w-full mt-2 btn btn-error text-white font-semibold rounded-lg">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden btn btn-ghost text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Cart, Notification, Profile Row */}
      {!loading && user && (
        <div className="flex md:hidden items-center justify-center gap-6 w-full py-2 bg-white/90 backdrop-blur-sm border-b border-indigo-100">
          {/* Cart Icon - redirect */}
          <button onClick={() => window.location.href = '/cart'} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <ShoppingCart className="h-6 w-6 text-indigo-700" />
              {cart.length > 0 && (
                <span className="badge badge-sm indicator-item bg-yellow-400 border-none text-indigo-700 font-bold">
                  {cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)}
                </span>
              )}
            </div>
          </button>
          {/* Notification Icon - redirect */}
          <button onClick={() => window.location.href = '/notifications'} className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </button>
          {/* Profile Icon - redirect */}
          <button onClick={() => window.location.href = '/profile'} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full ring ring-yellow-300 ring-offset-base-100 ring-offset-2">
              <img
                alt="Profile"
                src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              />
            </div>
          </button>
        </div>
      )}
      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white/90 backdrop-blur-sm absolute top-full left-0 w-full shadow transition-all duration-300 ${
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="font-semibold text-indigo-700 hover:text-pink-600 transition-colors">Home</Link>
          <Link href="#" className="font-semibold text-indigo-700 hover:text-pink-600 transition-colors">Contact</Link>
          <Link href="#" className="font-semibold text-indigo-700 hover:text-pink-600 transition-colors">About</Link>
          {!loading && (
            !user && (
              <Link href="/register" className="px-4 py-2 bg-yellow-300 text-indigo-700 font-bold rounded-md hover:bg-yellow-400 transition-colors shadow">
                Register
              </Link>
            )
          )}
          {/* Mobile Search */}
          <div className="flex items-center px-3 py-1 border border-indigo-200 rounded-lg bg-white w-11/12 relative">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm px-2 w-full"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={() => searchTerm.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100) }
              />
              <button type="submit" className="p-1">
                <Search className="h-4 w-4 text-indigo-500" />
              </button>
            </form>
             {/* Mobile Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md border border-indigo-100 z-10 overflow-hidden">
                {suggestions.map((suggestion: any, index: number) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-indigo-800 hover:bg-indigo-50 cursor-pointer"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

