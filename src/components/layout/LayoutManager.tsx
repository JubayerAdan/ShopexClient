"use client"
import useAuth from '@/app/hooks/useAuth'
import useAxiosPublic from '@/app/hooks/useAxiosPublic'
import React, { useEffect, useState } from 'react'


interface User {
    name: string,
    email: string,
    password: string,
    role: string,
    createdAt: string,
    addresses: string[],
    wishlist: string[],
    cart: any[]
}

function LayoutManager({children}: {children: React.ReactNode}) {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [email, setEmail] = useState<string>("")
    const {user, loading} = useAuth()
    const useAxios = useAxiosPublic();

    useEffect(() => {
        if (!loading && user) {
            setCurrentUser(user)
            setEmail(user.email)
        }
    }, [user, loading])
    useEffect(() => {
        async function FetchData() {
            const response = await useAxios.get(`/users/${email}`);
            setCurrentUser(response.data);
        }
        if (email) {
            FetchData();
        }
    }, [email])

    if (currentUser?.role === "admin") {
        return <div>
            {children}
        </div>
    } else if (currentUser?.role === "user") {
        return <div>
            {children}
        </div>
    } else if (currentUser?.role === "seller") {
        return <div>
            {children}
        </div>
    } else {
        return <div>
            <h1>Unauthorized</h1>
        </div>
    }

}

export default LayoutManager
