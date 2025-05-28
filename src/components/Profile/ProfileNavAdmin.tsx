"use client"
import Link from "next/link";
import { User, Package, Heart, Settings, CreditCard, LayoutDashboard, BoxIcon, GemIcon, DockIcon, UserCog } from "lucide-react";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProfileNavAdmin() {
  const pathname = usePathname();

  const links = [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/profile/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/profile/products", icon: BoxIcon, label: "Products" },
    { href: "/profile/sellers", icon: GemIcon, label: "Sellers" },
    { href: "/profile/applications", icon: DockIcon, label: "Applications" },
    { href: "/profile/users", icon: UserCog, label: "Users" },
    { href: "/profile/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="w-64 min-h-screen bg-background border-r p-6 hidden lg:block">
      <div className="sticky top-24 space-y-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-4">
          My Account
        </h3>
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors",
              pathname === href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </Link>          
        ))}
      </div>
    </nav>
  );
} 