"use client";
import React, { useEffect } from 'react'
import Header from '../Header'
import { usePathname, useRouter } from 'next/navigation';

export default function Layout(props) {
    const { children } = props
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const token = localStorage.getItem("userToken")
        if (!token) {
            router.push("/login")
        }
    }, [])

    return (
        <>
            {!(pathname?.includes("/login") || pathname?.includes("/signup")) && <Header />}
            {children}
        </>
    )
}
