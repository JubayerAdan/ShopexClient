"use client"
import Link from "next/link"

export const AdminDashboard = () => (
    <div className="space-y-2">
        <h2 className="text-xl font-bold">Admin Tools</h2>
        <Link href="/admin/dashboard" className="block p-2 hover:bg-accent">
            Dashboard
        </Link>
        <Link href="/admin/users" className="block p-2 hover:bg-accent">
            User Management
        </Link>
    </div>
)

export const SellerDashboard = () => (
    <div className="space-y-2">
        <h2 className="text-xl font-bold">Seller Tools</h2>
        <Link href="/seller/products" className="block p-2 hover:bg-accent">
            Product Management
        </Link>
        <Link href="/seller/orders" className="block p-2 hover:bg-accent">
            Order Tracking
        </Link>
    </div>
)

export const UserDashboard = () => (
    <div className="space-y-2">
        <h2 className="text-xl font-bold">User Tools</h2>
        <Link href="/profile/orders" className="block p-2 hover:bg-accent">
            My Orders
        </Link>
        <Link href="/profile/settings" className="block p-2 hover:bg-accent">
            Account Settings
        </Link>
    </div>
) 