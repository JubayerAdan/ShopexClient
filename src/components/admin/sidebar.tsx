"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Users, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-64 border-r bg-background p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
          >
            <Link href={item.href}>
              {item.icon}
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
} 