"use client";

import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "@/hooks/use-click-outside";

export default function CartDropdown() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        <ShoppingCart className="h-5 w-5" />
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
            {items.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 mx-auto h-[calc(100vh-4rem)] max-h-[32rem] max-w-sm overflow-hidden rounded-lg border bg-white shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:h-auto sm:w-80">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold">Shopping Cart</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="p-4">
              <p className="py-4 text-center text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="custom-scrollbar h-[calc(100%-8rem)] overflow-y-auto p-4 sm:h-[24rem]">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate text-sm font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-6 w-6"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 